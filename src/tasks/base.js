import uuid from 'node-uuid';

export class TaskBase {

  constructor (options = {}) {
    if (!options.id) {
      options.id = uuid.v1();
    }

    this.id = options.id;
    this.name = options.name;
    // this.process =
  }

}
