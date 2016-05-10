'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createS3EventTrigger = exports.createSQSTrigger = exports.createHttpTrigger = undefined;

var _http = require('./http');

var _http2 = _interopRequireDefault(_http);

var _sqs = require('./sqs');

var _sqs2 = _interopRequireDefault(_sqs);

var _s3event = require('./s3event');

var _s3event2 = _interopRequireDefault(_s3event);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createHttpTrigger = _http2.default;
exports.createSQSTrigger = _sqs2.default;
exports.createS3EventTrigger = _s3event2.default;