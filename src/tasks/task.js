import util from 'util';
import log  from '../logger';
import { TaskBase } from './base';
import { mixMeta } from './mixin_meta';
import { mixSource } from './mixin_source';
import { mixStatus } from './mixin_status';
import { mixTimeout } from './mixin_timeout';
import { s } from '../misc';

@mixMeta
@mixSource
@mixStatus
@mixTimeout
export class Task extends TaskBase {

  status = {
    "ready": [ 'running', 'done' ],
    "stop": [ 'running', 'done' ],
    "running": [ 'stop', 'done', 'failed', 'timeout' ],
    "failed": [ 'running', 'done' ],
    "timeout": [ 'running', 'done' ]
  };

  /**
   * start 启动任务 Task 将转进 running 状态，并初始化各项数据 ，任务管理
   * 器会监视任务的状态，是否有执行超时间等。
   */
  start () {
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
  }

  /** enterRunning 进入运行状态的事件*/
  enterRunning() {
    this.delay(s(3), () => this.transitionTo('timeout'));
  }

  /** enterTimeout 超时会自动杀死任务*/
  enterTimeout () {
    this.kill();
  }
}

export function createTask(opts, from ) {
  return new Task(opts);
}
