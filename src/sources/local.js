import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import _mkdirp from 'mkdirp';
import Promise from 'bluebird';
import assert from 'assert';

import {s, minute } from '../misc';
import * as fileType from './fileType';
import Source from './source';

import * as preprocesses from '../preprocesses';
import log from '../logger';
import config from '../config';
import { runnify } from '../runner';
import { mixin } from '../mixins';

var mkdirp = Promise.promisify(_mkdirp);

@mixin('task')
@mixin('marshal')
export class LocalSource extends Source {

  @runnify(__filename)
  read () {
    return Promise.all([
      this.mkdirp().timeout(s(3)),
      this.preprocessing().timeout(config.preprocesses.maxTime),
    ]).then(() => {
      // this.taskTransitionTo('done');
    }).catch(Promise.TimeoutError, (err) => {
      this.taskTransitionTo('timeout');
    }).catch(err => {
      this.taskClearTimeout();
      this.taskTransitionTo('error', err);
    });
  }

  mkdirp () {
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
    var { id, targetDir, source, fileType } = this;

    return {
      id,
      targetDir,
      source,
      fileType,
      taskId: this.task.id,
    }
  }
}

export const type = 'local';

export function create(source, opts) {
  return new LocalSource(source, opts)
}

export function validFormat (file) {
  try {
    fs.accessSync(file, fs.F_OK)
  } catch(err) {
    if (err.code === 'ENOENT') {
      return false
    } else {
      throw err
    }
  }

  return true;
}
