import assert from 'assert';
import fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';
import userid from 'userid';
import yaml from 'js-yaml';
// import {spawn} from 'child_process';

import log from '../logger';
import {copy} from './copy';
import {sudoSpawn} from './suspawn';

const argv = minimist(process.argv.slice(2));
const deployFile = path.join(argv.dir, argv.file);

try {
  var deploy = yaml.safeLoad(fs.readFileSync(deployFile, 'utf8'));

  assert(deploy.target, 'Deploy file must have spectify target');

  const user = deploy.owner;
  const group = typeof deploy.group !== 'undefined' ? deploy.group : user;
  let runOtps = {
    cwd: deploy.target
  };

  log.info('deploy config', deploy);
  log.info(`runas user ${user} and group ${group}`);

  if (user) {
    runOtps.uid = userid.uid(user);
    log.info(`runas command as ${user} of ${runOtps.uid}`);
  }

  if (group) {
    runOtps.gid = userid.gid(group);
  }

  copy(argv.dir, deploy.target, runOtps);

  if (deploy.script) {
    let runner = sudoSpawn(deploy.script, user, [], runOtps);

    runner.stdout.on('data', (data) => {
      log.info(`stdout: ${data}`);
    });

    runner.stderr.on('data', (data) => {
      log.error(`stderr: ${data}`);
    });

    runner.on('close', (code) => {
      log.info(`child process exited with code ${code}`);
    });
  }
} catch (err) {
  log.error(err);
}
