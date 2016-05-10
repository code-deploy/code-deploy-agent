import fs from 'fs';
import Promise from 'bluebird';

import Source from './source';

import log from '../logger';
import config from '../config';
// import {runnify} from '../runner';
import {mixin} from '../mixins';

@mixin('task')
@mixin('marshal')
export class LocalSource extends Source {

  read () {
    return Promise.all([
      this.mkdirp(),
      this.preprocessing().timeout(config.preprocesses.maxTime)
    ]).then(() => {
      // this.taskTransitionTo('done');
    }).catch(Promise.TimeoutError, (err) => {
      this.taskTransitionTo('timeout');
      log.error(err, err.stack);
    }).catch(err => {
      this.taskClearTimeout();
      this.taskTransitionTo('error', err);
    });
  }

}

export const type = 'local';

export function create(source, opts) {
  return new LocalSource(source, opts);
}

export function validFormat (file) {
  try {
    fs.accessSync(file, fs.F_OK);
  } catch(err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }

  return true;
}
