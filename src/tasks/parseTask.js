import { Task } from '../task';
import { createSource, parseSource } from './source';

export function parseTask(opts, from) {
  var task = new Task();

  task = createSourceTask(opts, task);

  return task;
}

function createSourceTask(opts, task) {
  const source = sourceType(opts)

  return function(task) {
    return {
      source: source,
      ...task,
    }
  }();
}

function sourceType (opts) {
  if (opts.sourceType) {
    return createSource(opts.source, opts.sourceType, opts);
  } else {
    return parseSource(opts.source);
  }
}
