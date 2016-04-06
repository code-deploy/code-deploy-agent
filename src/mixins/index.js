import assert from 'assert';
import util from 'util';
import task from './task';
import marshal from './marshal'
import meta from './meta';
import source from './source'
import status from './status';
import timeout from './timeout'


export {
  task,
  marshal,
  meta,
  source,
  status,
  timeout
}

export function mixin(name) {
  assert(exports[name], `Cant found this module '${name}'`);

  var mixind = exports[name]; //.mixind;

  return function(target) {
    return mixind(target);
  }
}
