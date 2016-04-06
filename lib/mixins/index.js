'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timeout = exports.status = exports.source = exports.meta = exports.marshal = exports.task = undefined;
exports.mixin = mixin;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _util = require('util');

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _marshal = require('./marshal');

var _marshal2 = _interopRequireDefault(_marshal);

var _meta = require('./meta');

var _meta2 = _interopRequireDefault(_meta);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _status = require('./status');

var _status2 = _interopRequireDefault(_status);

var _timeout = require('./timeout');

var _timeout2 = _interopRequireDefault(_timeout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.task = _task2.default;
exports.marshal = _marshal2.default;
exports.meta = _meta2.default;
exports.source = _source2.default;
exports.status = _status2.default;
exports.timeout = _timeout2.default;
function mixin(name) {
  var mixind;

  if (typeof name === 'string') {
    (0, _assert2.default)(exports[name], 'Cant found this module \'' + name + '\'');
    mixind = exports[name]; //.mixind;
  } else if ((0, _util.isFunction)(name)) {
      mixind = name;
    }

  return function (target) {
    return mixind(target);
  };
}