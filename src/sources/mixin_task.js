import assert from 'assert';

export function mixTask(Composed) {
  return class extends Composed {
    constructor(source, opts) {
      super(source, opts);

      // Composed.prototype.constructor.call(this, opts);
      assert(opts.task, 'Must pass task argument in opts');
      this.task = opts.task;
    }

    taskTransitionTo (state, data) {
      this.task.transitionTo(state, data);
    }

    taskTimeout(time) {
      this.taskTimeoutWithFunc(time, () => {
        this.taskTransitionTo('timeout');
      });
    }

    taskTimeoutWithFunc(time, cb) {
      this.task.delay(time, cb);
    }

    taskClearTimeout() {
      this.task._clearTimeout();
    }
  }
}
