import os from 'os';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';
import util from 'util';
// import Promise from 'bluebird';

import log from './logger';
import { taskPool } from './queue';
import { toCamelCase } from './misc';
import { triggerManager } from './triggerManager';
import config from './config';

var agentInstance;

function isProcessRunning(pid) {
  try {
    process.kill(pid + 0, 0);
    return true;
  } catch (err) {
    return false;
  }
}


class Agent {
  manager = triggerManager()

  static run() {
    agentInstance = new Agent;
    agentInstance.mainLoop();
  }

  checkLoaded() {
    const pidfile = path.join(config.workDir, config.pidfile);

    try{
      fs.accessSync(path.dirname(pidfile), fs.F_OK);

    } catch(err) {
      if (err.code === 'ENOENT') {
        mkdirp.sync(path.dirname(pidfile))
        fs.writeFileSync(pidfile, process.pid.toString());
      } else {
        log.error(err.message);
        process.exit(-1);
      }
    }

    var pid = parseInt(fs.readFileSync(pidfile));

    if (isProcessRunning(pid)) {
      log.error('Always running the deploy-agent instance. checking ', pidfile);
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
      } else {
        process.stdout.write('.');
      }
    } catch (err) {
      log.error(err.message);
      return;
    }
  }
}


Agent.run();

