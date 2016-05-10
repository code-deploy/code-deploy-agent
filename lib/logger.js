'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _argv = require('./argv');

var _argv2 = _interopRequireDefault(_argv);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var transports = _argv2.default ? [new _winston2.default.transports.Console(), new _winston2.default.transports.File({ filename: _config2.default.logfile, handleExceptions: true,
  humanReadableUnhandledException: true })] : [new _winston2.default.transports.Console()];
// import fs from 'fs';
// import Logger from 'js-logger';


console.log(transports);

var logger = new _winston2.default.Logger({
  level: 'info',
  transports: transports
});

exports.default = logger;