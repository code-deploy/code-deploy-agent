'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSQSTrigger = exports.createHttpTrigger = undefined;

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _sqs = require('./sqs');

var _sqs2 = _interopRequireDefault(_sqs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createHttpTrigger = _http2.default;
exports.createSQSTrigger = _sqs2.default;