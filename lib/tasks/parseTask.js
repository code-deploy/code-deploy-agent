'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;
exports.parseTask = parseTask;

var _task = require('../task');

var _source = require('./source');

var _meta = require('./meta');

function factory(opts, from) {
  // var task = new Task(opts);
  var Factory;

  Factory = (0, _meta.FactoryMeta)(_task.Task);
  Factory = (0, _source.FactorySource)(Factory);
  console.log(Factory);
  return Factory;
}

function parseTask(opts, from) {
  var TaskClass = factory(opts, from);
  return new TaskClass(opts);
}