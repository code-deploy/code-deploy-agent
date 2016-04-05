import assert from 'assert';
import util, { isFunction } from 'util';
import config from '../config';
import misc from '../misc';

export default function mixind(Composed) {

  return class extends Composed {
    /**
     * status 状态机的状态配置
     *
     * @example
     *
     * const TaskStatus = ['running', 'done', 'ready', 'failed', 'timeout'];
     *
     * status = {
     *   "ready": [ 'running', 'done' ],
     *   "running": [ 'done', 'failed', 'timeout' ],
     *   "failed": [ 'running', 'done' ],
     *   "timeout": [ 'running', 'done' ]
     * };
     *
     * status Events 使用加 enter 或 leave  状态命名规则的 方法来达到响应事件。
     * 如
     *   enterRunning (data) {
     *     ....
     *   }
     *
     */
    state = "ready"

    constructor(opts) {
      super(opts);
    }

    transitionTo (state, data) {
      var { status } = this;
      var availableTargetStates = status[this.state] ? status[this.state] : status['*'] || [];

      var inState = !!~availableTargetStates.indexOf(state);
      var camel = (...args) => args.join(' ').toCamelCase();

      assert(inState, util.format("Can't transition from %s to %s", this.state, state));

      var enter = this[camel('enter', state)];
      var leave = this[camel('leave', this.state)];
      var trigger = (meth, ...args) => meth.call(this, ...args);

      if (isFunction(leave)) { trigger(leave, data); }

      this.state = state;

      if (isFunction(enter)) { trigger(enter, data); }

      return true;
    }

    getState () {
      return this.state;
    }
  }
}
