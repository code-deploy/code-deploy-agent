'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.tasks = [];
  }

  _createClass(Queue, [{
    key: 'next',
    value: function next() {
      var task = this.tasks[0];
      if (task.isRunning()) {
        return task;
      } else if (task.isReady()) {
        return task;
      } else if (task.isDone()) {
        this.tasks.shift();
        return task;
      } else if (task.isTimeout()) {
        this.tasks.shift();
        return task;
      } else if (task.isFailed()) {
        this.tasks.shift();
        return task;
      }
      return null;
    }
  }, {
    key: 'push',
    value: function push(task) {
      return this.tasks.push(task);
    }
  }]);

  return Queue;
}();

exports.default = Queue;