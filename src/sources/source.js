import path from 'path';
import uuid from 'node-uuid';

import config from '../config';
import * as fileType from './fileType';

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
}
