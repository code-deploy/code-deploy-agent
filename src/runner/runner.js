import assert from 'assert';
import yaml from 'js-yaml';
import minimist from 'minimist';
import path from 'path';
import log from '../logger';
import fs from 'fs-extra';
import { spawn } from 'child_process';

const argv = minimist(process.argv.slice(2));
const deployFile = path.join(argv.dir, argv.file);

try {
  var deploy = yaml.safeLoad(fs.readFileSync(deployFile, 'utf8'));

  assert(deploy.target, 'Deploy file must have spectify target');

  fs.copySync(argv.dir, deploy.target)
  if (deploy.script) { spawn(deploy.script, [], { cwd: argv.dir }) }
} catch (err) {
  log.error(err);
}
