import Promise from 'bluebird';
import AWS from 'aws-sdk';
import url from 'url';
import path from 'path';
import fs from 'fs';
import assert from 'assert';
import tmp from 'tmp';

import Source from './source';
import log from '../logger';
import config from '../config';
// import {runnify} from '../runner';
import {mixin} from '../mixins';
import * as preprocesses from '../preprocesses';

const writeFileAsync = Promise.promisify(fs.writeFile);
const tmpDirAsync = Promise.promisify(tmp.dir);

Promise.sequence = function (chain) {
  var results = [];
  var entries = chain;
  if (entries.entries) entries = entries.entries();
  return new Promise(function (yes, no) {
    var next = function () {
      var entry = entries.next();
      if(entry.done) yes(results);
      else {
        results.push(entry.value[1]().then(next, function() { no(results); } ));
      }
    };
    next();
  });
};

@mixin('task')
@mixin('marshal')
export class S3Source extends Source {

  constructor (source, opts) {
    super(source, opts);
    const {accessKeyId, secretAccessKey, region, apiVersion} = config;
    const _url = url.parse(source);

    this.bucket = _url.host;
    this.key = _url.path.slice(1);

    this.s3 = Promise.promisifyAll(new AWS.S3({
      // endpoint,
      accessKeyId,
      secretAccessKey,
      region,
      apiVersion
    }));
  }

  read () {
    this.mkdirp()
    .then(() => {
      return this.fetchS3().timeout(config.downloads.maxTime);
    }).then(() => {
      return this.preprocessing().timeout(config.preprocesses.maxTime);
    }).then(() => {
      // this.taskTransitionTo('done');
    }).catch(Promise.TimeoutError, (err) => {
      this.taskTransitionTo('timeout');
      log.error(err, err.stack);
    }).catch(err => {
      this.taskClearTimeout();
      this.taskTransitionTo('error', err);
    });
  }

  fetchS3() {
    return new Promise((res, rej) => {
      tmpDirAsync()
      .then((tmpDir) => {
        log.info(`mkdir tmpdir ${tmpDir}`);
        return this.s3.getObjectAsync({Bucket: this.bucket, Key: this.key}).then(data => {
          const file = path.join(tmpDir, this.key);
          this.tempfile = file;
          log.info(`Write to file ${file}`);
          const {Body} = data;
          return writeFileAsync(file, Body);
        })
        .then(res)
        .catch(err => {
          rej(err);
          this.taskClearTimeout();
          this.taskTransitionTo('error', err);
        });
      });
    });
  }

  preprocessing () {
    let preprocess;

    if (this.fileType) {
      preprocess = preprocesses[this.fileType];
    } else {
      preprocess = preprocesses.try(this.tempfile);
    }

    assert(preprocess, 'Invalid preprocess type in this file ' + this.tempfile);
    log.info(`Preprocess intermedia ${this.tempfile} to ${this.targetDir}`);
    return preprocess.extract(this.tempfile, this.targetDir, {overwrite: true});
  }
}


export const type = 's3';

export function create(source, opts) {
  return new S3Source(source, opts);
}

export function validFormat (file) {
  return /^s3:\/\//.test(file);
}
