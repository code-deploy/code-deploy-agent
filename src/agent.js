import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

import log from './logger';
import * as taskManager from './taskManager';
import config from './config';

var agentInstance;

function isRunning(pid) {
  try {
    return process.kill(pid,0);
  }
  catch (e) {
    return e.code === 'EPERM';
  }
}


class Agent {

  static run() {
    agentInstance = new Agent();
    agentInstance.mainLoop();
  }

  // check /tmp/deploy-agent.pid
  checkLoaded() {
    const pidfile = path.join(config.workDir, config.pidfile);

    try{
      fs.accessSync(path.dirname(pidfile), fs.F_OK);

    } catch(err) {
      if (err.code === 'ENOENT') {
        mkdirp.sync(path.dirname(pidfile));
        fs.writeFileSync(pidfile, process.pid.toString());
      } else {
        log.error(err.stack);
        process.exit(-1);
      }
    }

    var pid = parseInt(fs.readFileSync(pidfile));

    if (isRunning(pid)) {
      log.error('Always running the deploy-agent instance. checking ', pidfile);
      process.exit(-1);
    } else {
      fs.writeFileSync(pidfile, process.pid.toString());
    }
  }

  // Ctrl + c break;
  trap(signal, cb) {
    process.on(signal, function() {
      log.error('Caught interrupt signal');
      cb();
    });
  }

  mainLoop () {
    this.checkLoaded();
    this.trap('SIGINT', () => process.exit());

    taskManager.run();
  }
}

Agent.run();

