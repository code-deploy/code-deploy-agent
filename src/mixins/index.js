import assert from 'assert';
import {isFunction} from 'util';
import task from './task';
import marshal from './marshal';
import meta from './meta';
import source from './source';
import status from './status';
import timeout from './timeout';



export {
  task,
  marshal,
  meta,
  source,
  status,
  timeout
};

export function mixin(name) {
  var mixind;

  if (typeof name === 'string') {
    assert(exports[name], `Cant found this module '${name}'`);
    mixind = exports[name]; //.mixind;
  } else if (isFunction(name)) {
    mixind = name;
  }

  return function(target) {
    return mixind(target);
  };
}
