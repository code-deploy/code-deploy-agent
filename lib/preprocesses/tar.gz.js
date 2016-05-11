'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;
exports.extractStream = extractStream;
exports.tryCodec = tryCodec;

var _tarballExtract = require('tarball-extract');

var _tarballExtract2 = _interopRequireDefault(_tarballExtract);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tarballExtract(tar, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var cb = arguments[3];

  _logger2.default.info('tar.gz extract...');
  _tarballExtract2.default.extractTarball(tar, to, cb);
} // import targz from 'tar.gz';


var extract = exports.extract = (0, _bluebird.promisify)(tarballExtract);

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
function extractStream(from, to) {}

/**
 * try 尝试验证 targz 文件方法，必须实现
 * @param  {string} file 输入文件路径名
 * @return {boolean}      正确格式返回 true
 */
function tryCodec(file) {
  return false;
}