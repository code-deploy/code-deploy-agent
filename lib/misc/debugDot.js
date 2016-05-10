'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dot = dot;

var _argv = require('../argv');

var _argv2 = _interopRequireDefault(_argv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function dot() {
  if (_argv2.default.process) {
    process.stdout.write('.');
  }
}