import {spawn} from 'child_process';
import {userEnv} from './userEnv';
import log from '../logger';

const RUNNER_ENVIROMENT_NAMES = [ 'SHELL', 'USER', 'PATH' ];

export function suspawn(command, user, options = {}) {
  log.info(`run command ${command} in ${options['cwd']}`);
  return spawn('sudo', ['-Hiu', user, `${options['cwd']}/${command}`], {...options});
}

export function sudoSpawn(command, user, args = [], options = {}) {
  const ENV = userEnv(user);
  let runEnv = {};

  RUNNER_ENVIROMENT_NAMES.forEach( name => {
    runEnv[name] = ENV[name];
  });

  return spawn(command, args, { ...options, env: runEnv });
}
