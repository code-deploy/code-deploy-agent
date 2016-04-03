'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.taskPool = exports.Queue = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.createTask = createTask;

var _tasks = require('./tasks');

var _tasks2 = _interopRequireDefault(_tasks);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Queue = exports.Queue = function () {
  function Queue() {
    _classCallCheck(this, Queue);

    this.tasks = [];
  }

  _createClass(Queue, [{
    key: 'next',
    value: function next() {
      var task = this.tasks[0];

      if (task) {
        return task;
        // if (task.isRunning()) {
        //   return task;
        // } else if (task.isReady()) {
        //   return task;
        // } else if (task.isDone()) {
        //   this.tasks.shift();
        //   return task;
        // } else if (task.isTimeout()) {
        //   this.tasks.shift();
        //   return task;
        // } else if (task.isFailed()) {
        //   this.tasks.shift();
        //   return task;
        // } else {
        //   return null;
        // }
      } else {
          return null;
        }
    }
  }, {
    key: 'push',
    value: function push(task) {
      return this.tasks.push(task);
    }
  }]);

  return Queue;
}();

var taskPool = exports.taskPool = new Queue();

function createTask(options) {
  var task = _tasks2.default.createTask(options);

  taskPool.push(task);
  return task;
}

// if (!taskPooler) { taskPooler = new Queue; }