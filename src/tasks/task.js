import assert from 'assert';
import log from '../logger';
import {TaskBase} from './base';

import {s} from '../misc';
import {mixin} from '../mixins';
import execute from './execute';

/**
 * Task 任务基础元数据
 * 1. name: 任务名称, 做为独立的任务划分区分，通常会导致同类的任务堆叠且顺序的执行。
 * 2. source: 资源来源
 *   a. sourceType: （可选）资源类型，包括，（local) 本地文件系统， (http)
 *       互联网资源系统 （ftp) 文件传输协议 (s3) 亚马逊存储服务地址等。
 *   b. source: 资源实际地址，根据不同的类型 sourceType
 *       会区分不同的，获取资源的方式，比如（local Agent
 *      会访问地址文件地址 , s3 会启用 AWS s3 下载方式进行下载)。
 *   c. fileType: （可选）文件类型会指明 source
 *       资源的下载后的文件类型是什么，一般会自动根据资源类型的后缀进行判断
 *       但是指定时会，会使文件在打开前，进行文件打开的预处理（类型支持为
 *       zip , tar.gz, tar.bz2) 通常是解压
 *
 * 3. action: 动作类型，告诉 Agent 对于下载的资源进行什么样的操作，通常是 Uncompress,
 *       Nothing, Parse (默认动作)
 *    a. deployFile: 动作文件指定，默认是(资源根目录下面的 deploy.yml)
 *    b. inline: 内置脚本执行不需要 deployFile 的存在
 *
 * 4. 执行期的参数
 *   createAt: 任务生成的时间，通常是收到任务触发信号的时间
 *   updateAt: 任务发生变更状态的时间，最后一次状态变更的时间
 *   startAt: 任务真实开始执行的时间
 *   endAt: 任务失败或完成的时间
 *
 *   stepTimeout: 每个任务步骤最长无响应时间，单位为秒， 默认 120s
 *
 */
@mixin('meta')              // 原信息模块
@mixin('source')            // 资源模块
@mixin('status')            // 状态机模块
@mixin('timeout')           // 延时模块
@mixin(execute)             // 执行模块
export class Task extends TaskBase {

  status = {
    'ready': ['running', 'done'],
    'stop': ['running', 'done'],
    'running': ['stop', 'done', 'error', 'timeout'],
    'error': ['running', 'done', 'timeout'],
    'timeout': ['running', 'done']
  };

  /**
   * start 启动任务 Task 将转进 running 状态，并初始化各项数据 ，任务管理
   * 器会监视任务的状态，是否有执行超时间等。
   */
  start () {
    assert(this.source, 'Invalid source, this ' +  this.id + 'cant have source');

    Promise.resolve(this.source.read())
    .then(targetDir => {
      return this.execute(targetDir);                  // 执行部署脚本
    }).then(() => {
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

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
export function createTask(opts, from ) {
  return new Task(opts);
}
