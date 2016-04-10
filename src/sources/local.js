import fs from 'fs';
import _mkdirp from 'mkdirp';
import Promise from 'bluebird';
import assert from 'assert';

import Source from './source';

import * as preprocesses from '../preprocesses';
import log from '../logger';
import config from '../config';
// import {runnify} from '../runner';
import {mixin} from '../mixins';

var mkdirp = Promise.promisify(_mkdirp);

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

  mkdirp () {
    log.info(`Task ${this.id} Created path to ${this.targetDir}`);
    return mkdirp(this.targetDir);
  }

  preprocessing () {
    var preprocess;

    if (this.fileType) {
      preprocess = preprocesses[this.fileType];
    } else {
      preprocess = preprocesses.try(this.source);
    }

    assert(preprocess, 'Invalid preprocess type in this source ' + this.source);

    return preprocess.extract(this.source, this.targetDir, {overwrite: true});
  }

  dump() {
    var {id, targetDir, source, fileType} = this;

    return {
      id,
      targetDir,
      source,
      fileType,
      taskId: this.task.id
    };
  }

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/
  load(object) {

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
