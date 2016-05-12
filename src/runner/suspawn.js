import {spawn} from 'child_process';
import log from '../logger';

export function suspawn(command, user, options = {}) {
  log.info(`run command ${command} in ${options['cwd']}`);
  return spawn('sudo', ['-Hiu', user, `${options['cwd']}/${command}`], {...options});
}
