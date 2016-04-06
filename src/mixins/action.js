import assert from 'assert';

export default function mixind(Composed) {
  return class extends Composed {
    constructor(source, opts) {
      super(source, opts);

      if (opts.aciton) {
        this.action = opts.action;
      } else {
        this.action = 'Uncompress';
      }
      this.task = opts.action;
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
