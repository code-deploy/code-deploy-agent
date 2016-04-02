import { Task } from '../task';
import { createSource, parseSource } from './source';

export function factory(opts, from) {
  // var task = new Task(opts);

  var Factory = FactorySource(Task);

  return Factory;
}

export function parseTask(opts, from ) {
  var TaskClass = factory(opts, from )
  return new TaskClass(opts);
}

function sourceType (opts) {
  if (opts.sourceType) {
    return createSource(opts.source, opts.sourceType, opts);
  } else {
    return parseSource(opts.source);
  }
}

export var FactorySource = () => class extends Task {
  constructor(opts) {
    super(opts);

    this.sourceUrl = this.source;
    this.source = sourceType(opts);
  }
}
