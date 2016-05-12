'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.suspawn = suspawn;

var _child_process = require('child_process');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function suspawn(command, user) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  _logger2.default.info('run command ' + command + ' in ' + options['cwd']);
  return (0, _child_process.spawn)('sudo', ['-u', user, options['cwd'] + '/' + command], _extends({}, options));
}