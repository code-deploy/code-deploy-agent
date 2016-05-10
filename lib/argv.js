'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('./misc/toCamelCase');

var _argv = (0, _minimist2.default)(process.argv.slice(2));
var argv = {};

for (var key in _argv) {
  argv[key.toCamelCase()] = _argv[key];
}

exports.default = argv;