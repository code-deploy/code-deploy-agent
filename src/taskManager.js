import config from './config';
import {taskPool} from './queue';
import log from './logger';
import {triggerManager} from './triggerManager';
import {dot} from './misc';

/*eslint no-unused-vars: ["error",{ "varsIgnorePattern": "manager" }]*/
const manager = triggerManager();

export function killTask(taskId) {
  for (var i = 0; i < taskPool.tasks.length; i++) {
    var task = taskPool.tasks[i];
    if (task && (task.id === taskId || task === taskId)) {
      log.debug(`Killing Task :${task.id}`);
      task.kill();
      taskPool.tasks.splice(i,1);
    }
  }
}

function done(taskId) {
  for (var i = 0; i < taskPool.tasks.length; i++) {
    var task = taskPool.tasks[i];
    if (task && (task.id === taskId || task === taskId)) {
      log.debug(`Task :${task.id} is done`);
      task.kill();
      taskPool.tasks.splice(i,1);
    }
  }
}


export function listTask() {
  return taskPool.tasks;
}

export function startTask(taskId) {
  var task = taskPool.find(taskId);
  log.debug(`Starting Task ${task.id}`);
  task.start();
}

export function stopTask(taskId) {
  var task = taskPool.find(taskId);
  log.debug(`Stop Task ${task.id}`);
  task.stop();
}

var timerManager;

export function run() {

  if (timerManager) { clearInterval(timerManager); }

  timerManager = setInterval(() => _main(), config.tasks.checkInterval);
  timerManager.ref();
}

function _main() {

  safe(() => each((task) => {
    switch (task.getState()) {
    case 'ready':
      startTask(task);
      break;
    case 'running':
      console.log('running count', runningTasks().length, 'pending count', taskPool.tasks.length);
      break;
    case 'done':
      done(task);
      break;
    case 'error':
      console.log('error');
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
  }));
}

function safe(cb) {
  try {
    if (taskPool.tasks.length === 0) { dot(); /* process.stdout.write('.');*/ }

    cb();
  } catch (err) {
    log.error(err.stack);
  }
}

// function concurrency(cb)  {
//   var start = 0;

//   each(cb);
// }

function each(cb) {
  var runnings = 0;

  for (var i = 0; i < taskPool.tasks.length; i++) {
    var task = taskPool.tasks[i];

    if (task) {
      var state = task.getState();

      if (state === 'running') {
        runnings++;
      }

      if (state === 'ready' && runnings >= config.tasks.concurrency) {
        continue;
      } else {
        runnings++;
      }

      cb(task);
    } else {
      dot();
      // process.stdout.write('.');
    }
  }
}

function runningTasks() {
  var tasks = [];
  for (var i = 0; i < taskPool.tasks.length; i++) {
    var task = taskPool.tasks[i];
    if (task.getState() === 'running') { tasks.push(task); }
  }

  return tasks;
}
