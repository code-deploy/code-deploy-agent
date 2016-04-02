import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';
import mkdirp from 'mkdirp';

import fileType from './fileType';
import Source from './source';

import config from '../config';
import preprocesses from '../preprocesses';

const incomingDir = path.join(config.workDir, 'incoming/local')

class LocalSource extends Source {

  constructor(source, targetDir) {
    super()

    this.id = uuid.v1();
    this.targetDir = path.join(incomingDir, this.id);
    this.source = source;
    this.fileType = fileType.check(source);
  }

  read () {
    mkdirp.sync(this.targetDir);

    this.preprocessing();

    return this.targetDir;
  }

  preprocessing () {
    var preprocess;
    if (this.fileType) {
      preprocess = preprocesses[this.fileType];
    } else {
      preprocess = preprocesses.try(this.source);
    }

    assert(preprocess, 'Invalid preprocess type in this source ' +this.source);

    preprocess.extract(this.source, this.targetDir);
  }
}

export const type = 'local';

export function create(source, opts) {
  return new LocalSource(source, targetPath)
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
