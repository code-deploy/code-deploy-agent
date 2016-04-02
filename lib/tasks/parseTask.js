'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.parseTask = parseTask;

var _task = require('../task');

var _source = require('./source');

function parseTask(opts, from) {
  var task = new _task.Task();

  task = createSourceTask(opts, task);

  return task;
}

function createSourceTask(opts, task) {
  var source = sourceType(opts);

  return function (task) {
    return _extends({}, task, {
      source: source
    });
  }();
}

function sourceType(opts) {
  if (opts.sourceType) {
    return (0, _source.createSource)(opts.source, opts.sourceType, opts);
  } else {
    return (0, _source.parseSource)(opts.source);
  }
}