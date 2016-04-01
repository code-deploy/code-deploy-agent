import Config from './config';
import os from 'os';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import Promise from 'bluebird';

import { taskPool } from './queue';
import { toCamelCase } from './misc';
import { triggerManager } from './triggerManager';

console.log(taskPool);
var agentInstance;

function processRunning(pid) {
  try {
    process.kill(pid + 0, 0);
    return true;
  } catch (err) {
      return false;
  }
}

var TaskStatus = ['running', 'done', 'ready', 'failed', 'timeout'];

function checkTaskState(task) {
  for (var i = 0; i < TaskStatus.length; i++) {
    var state = TaskStatus[i];
    var methodName = 'is' + state.toCamelCase();
    var stateMethod = task[methodName];

    if (util.isFunction(stateMethod)) {
      if (stateMethod.call(task)) {
        return methodName;
      }
    }
  }

  return 'unknown';
}

class Agent {
  manager = triggerManager()

  static run() {
    agentInstance = new Agent;
    agentInstance.mainLoop();
  }

  checkLoaded() {
    const pidfile = path.join('/tmp/deploy-agent/', 'deploy-agent.pid');

    try{
      fs.accessSync(path.dirname(pidfile), fs.F_OK);

    } catch(err) {
      if (err.code === 'ENOENT') {
        mkdirp.sync(path.dirname(pidfile))
        fs.writeFileSync(pidfile, process.pid.toString());
      } else {
        console.error(err);
        process.exit(-1);
      }
    }    

    var pid = parseInt(fs.readFileSync(pidfile));

    if (processRunning(pid)) {
      console.error('Always running the deploy-agent instance. checking ', pidfile);
      process.exit(-1);
    } else {
      fs.writeFileSync(pidfile, process.pid.toString());
    }
  }

  trap(signal, cb) {
    process.on(signal, function() {
      console.log("Caught interrupt signal");
      cb();
    });    
  }

  mainLoop () {
    this.checkLoaded();
    this.trap('SIGINT', () => process.exit());

    var timer = setInterval(() => this._main(), 100);
    timer.ref();
  }

  _main() {
    try {
      var task = taskPool.next();

      if (task) {
        switch (checkTaskState(task)) {
          case 'ready':
            console.log('ready');
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
            console.log('unknown');
        }
      } else {
        process.stdout.write('.');
      }
    } catch (err) {
      console.error(err.stack);
      return;
    }
  }
}


Agent.run();

