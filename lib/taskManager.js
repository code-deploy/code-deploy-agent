'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.killTask = killTask;
exports.listTask = listTask;
exports.startTask = startTask;
exports.stopTask = stopTask;
exports.run = run;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _queue = require('./queue');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _triggerManager = require('./triggerManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager = (0, _triggerManager.triggerManager)();

function killTask(taskId) {
  for (var i = 0; i < _queue.taskPool.tasks.length; i++) {
    var task = _queue.taskPool.tasks[i];
    if (task && (task.id === taskId || task === taskId)) {
      _logger2.default.debug(_util2.default.format("Killing Task :%s", task.id));
      task.kill();
      _queue.taskPool.tasks.splice(i, 1);
    }
  }
}

function listTask() {
  return _queue.taskPool.tasks;
}

function startTask(taskId) {
  var task = _queue.taskPool.find(taskId);
  _logger2.default.debug(_util2.default.format("Starting Task %s", task.id));
  task.start();
}

function stopTask(taskId) {
  var task = _queue.taskPool.find(taskId);
  _logger2.default.debug(_util2.default.format("Stop Task %s", task.id));
  task.stop();
}

var timerManager;

function run() {

  if (timerManager) {
    clearInterval(timerManager);
  }

  timerManager = setInterval(function () {
    return _main();
  }, _config2.default.tasks.checkInterval);
  timerManager.ref();
}

function _main() {

  safe(function () {
    return each(function (task) {
      switch (task.getState()) {
        case 'ready':
          startTask(task);
          break;
        case 'running':
          console.log('running count', runningTasks().length, 'pending count', _queue.taskPool.tasks.length);
          break;
        case 'done':
          console.log('done');
          break;
        case 'failed':
          console.log('failed');
          break;
        case 'timeout':
          console.log('timeout');
          killTask(task);
          break;
        default:
          console.log(task.getMeta('createdAt'));
          console.log('unknown');
          killTask(task);
      }
    });
  });
}

function safe(cb) {
  try {
    if (_queue.taskPool.tasks.length === 0) {
      process.stdout.write('.');
    }

    cb();
  } catch (err) {
    _logger2.default.error(err);
  }
}

function concurrency(cb) {
  var start = 0;

  each(cb);
}

function each(cb) {
  var runnings = 0;

  for (var i = 0; i < _queue.taskPool.tasks.length; i++) {
    var task = _queue.taskPool.tasks[i];

    if (task) {
      var state = task.getState();

      if (state === 'running') {
        runnings++;
      }

      if (state === 'ready' && runnings >= _config2.default.tasks.concurrency) {
        continue;
      } else {
        runnings++;
      }

      cb(task);
    } else {
      process.stdout.write('.');
    }
  }
}

function runningTasks() {
  var tasks = [];
  for (var i = 0; i < _queue.taskPool.tasks.length; i++) {
    var task = _queue.taskPool.tasks[i];
    if (task.getState() === 'running') {
      tasks.push(task);
    }
  }

  return tasks;
}