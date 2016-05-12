import assert from 'assert';
import fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';
import userid from 'userid';
import yaml from 'js-yaml';
import {spawn} from 'child_process';

import log from '../logger';
import {copy} from './copy';

const argv = minimist(process.argv.slice(2));
const deployFile = path.join(argv.dir, argv.file);

try {
  var deploy = yaml.safeLoad(fs.readFileSync(deployFile, 'utf8'));

  assert(deploy.target, 'Deploy file must have spectify target');

  const user = deploy.owner;
  const group = deploy.group || user;
  let runOtps = {
    cwd: deploy.target
  };

  if (user) {
    runOtps.uid = userid.uid(user);
  }

  if (group) {
    runOtps.gid = userid.gid(group);
  }

  copy(argv.dir, deploy.target, runOtps);

  if (deploy.script) { spawn(deploy.script, [], runOtps); }
} catch (err) {
  log.error(err);
}
