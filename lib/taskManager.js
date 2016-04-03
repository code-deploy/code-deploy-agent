'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.killTask = killTask;
exports.listTask = listTask;
exports.startTask = startTask;
exports.stopTask = stopTask;
exports.run = run;

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _queue = require('./queue');

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _triggerManager = require('./triggerManager');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var manager = (0, _triggerManager.triggerManager)();

function killTask(taskId) {}

function listTask() {
  return _queue.taskPool.tasks;
}

function startTask(taskId) {
  // body...
}

function stopTask(taskId) {
  // body...
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

  (function (safe) {
    return function (concurrent) {
      return nextTask(function (task) {
        switch (task.getState()) {
          case 'ready':
            console.log('ready');
            task.start();
            break;
          case 'running':
            console.log('running');
            break;
          case 'done':
            console.log('done');
            break;
          case 'failed':
            console.log('failed');
            break;
          case 'timeout':
            console.log('timeout');
            break;
          default:
            console.log(task.getMeta('createdAt'));
            console.log('unknown');
        }
      });
    };
  });
}

function safe(cb) {
  try {
    cb();
  } catch (err) {
    console.log(err);
    _logger2.default.error(err);
  }
}

function concurrnet(cb) {
  for (var i = 0; i < _config2.default.tasks.concurrent; i++) {
    cb();
  }
}

function nextTask(cb) {
  var task = queue.next();
  console.log(task);
  if (task) {
    cb(task);
  } else {
    process.stdout.write('.');
  }
}