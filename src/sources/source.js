import path from 'path';
import uuid from 'node-uuid';
import assert from 'assert';
import _mkdirp from 'mkdirp';
import Promise from 'bluebird';

import config from '../config';
import log from '../logger';

import * as preprocesses from '../preprocesses';
import * as fileType from './fileType';

const mkdirp = Promise.promisify(_mkdirp);
const incomingDir = path.join(config.workDir, 'incoming/local');

export default class Source {

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/
  constructor(source, opts) {
    this.id = uuid.v1();
    this.targetDir = path.join(incomingDir, this.id);
    this.source = source;
    this.fileType = fileType.check(source);
  }

  // pure function
  read () {

  }

  mkdirp () {
    log.info(`Task ${this.id} Created path to ${this.targetDir}`);
    return mkdirp(this.targetDir);
  }

  preprocessing () {
    let preprocess;

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
