import assert from 'assert';
import config from '../config';
// import { Task } from '../task';

const MetaInfo = [
  "createdAt", 
  "updatedAt",
  "startAt",
  "endAt"
];

export function featureMeta(Composed) {

  return class extends Composed {

    constructor(opts) {
      super(opts);

      this.meta = {}
      this.meta.createdAt = new Date();
      this.meta.updatedAt = this.meta.createdAt;
      this.meta.stepTimeout =  opts.stepTimeout || config.stepTimeout;
    }

    setMeta (key, value) {
      if (!!~MetaInfo.indexOf(key)) {
        this.meta[key] = value;
      }
      return this.meta[key];
    }

    getMeta (key) {
      if (!!~MetaInfo.indexOf(key)) {
        return this.meta[key];
      } else {
        return null;
      }
    }
  }
}
