'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.suspawn = suspawn;
exports.sudoSpawn = sudoSpawn;

var _child_process = require('child_process');

var _userEnv = require('./userEnv');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RUNNER_ENVIROMENT_NAMES = ['SHELL', 'USER', 'PATH'];

function suspawn(command, user) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  _logger2.default.info('run command ' + command + ' in ' + options['cwd']);
  return (0, _child_process.spawn)('sudo', ['-Hiu', user, options['cwd'] + '/' + command], _extends({}, options));
}

function sudoSpawn(command, user) {
  var args = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
  var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var ENV = (0, _userEnv.userEnv)(user);
  var env = options.env;

  var runEnv = _extends({}, env);

  RUNNER_ENVIROMENT_NAMES.forEach(function (name) {
    runEnv[name] = ENV[name];
  });

  return (0, _child_process.spawn)(command, args, _extends({}, options, { env: runEnv }));
}