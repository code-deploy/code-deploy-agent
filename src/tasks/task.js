import assert from 'assert';
import log  from '../logger';
import { TaskBase } from './base';

import { s } from '../misc';
import { mixin } from '../mixins';

@mixin('meta')              // 原信息模块
@mixin('source')            // 资源模块
@mixin('status')            // 状态机模块
@mixin('timeout')           // 延时模块
export class Task extends TaskBase {

  status = {
    "ready": [ 'running', 'done' ],
    "stop": [ 'running', 'done' ],
    "running": [ 'stop', 'done', 'error', 'timeout' ],
    "error": [ 'running', 'done', 'timeout' ],
    "timeout": [ 'running', 'done' ]
  };

  /**
   * start 启动任务 Task 将转进 running 状态，并初始化各项数据 ，任务管理
   * 器会监视任务的状态，是否有执行超时间等。
   */
  start () {
    assert(this.source, 'Invalid source, this ' +  this.id + 'cant have source');

    Promise.all([
      this.source.read(),             // 下载源文件
      this.execute()                  // 执行部署脚本
    ]).then(result => {
      this.transitionTo('done');
    }).catch(Promise.TimeoutError, () => {
      this.transitionTo('timeout');
    }).catch(err => {
      this.transitionTo('error', err);
    });

    this.transitionTo('running');
  }

  /**
   * stop 停止任务，会保存任务的数据，把任务转入停止状态。
   */
  stop () {
    this.transitionTo('stop');
  }

  /**
   * kill 杀死任务，会将任务完全移出 任务列队(quque) 不再占用内存等
   * Agent 也不再监控它的状态，即彻底的死亡
   */
  kill () {
    this._clearTimeout();
  }

  execute () {
    return Promise.resolve(() => true );
  }

  /** enterRunning 进入运行状态的事件*/
  enterRunning() {
    this.delay(s(20), () => this.transitionTo('timeout'));
  }

  /** enterTimeout 超时会自动杀死任务*/
  enterTimeout () {
    this.kill();
  }

  enterError(err) {
    log.error(err.stack);
  }
}

export function createTask(opts, from ) {
  return new Task(opts);
}
