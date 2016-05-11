'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;
exports.extractStream = extractStream;
exports.tryCodec = tryCodec;

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _buckle = require('buckle');

var _buckle2 = _interopRequireDefault(_buckle);

var _util = require('adm-zip/util');

var _util2 = _interopRequireDefault(_util);

var _bluebird = require('bluebird');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buckleExtract(zip, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var cb = arguments[3];

  _logger2.default.info('zip extract...');
  _buckle2.default.open(zip, to, cb);
}

var extract = exports.extract = (0, _bluebird.promisify)(buckleExtract);

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
function extractStream(from, to) {}

/**
 * try 尝试验证 zip 文件方法，必须实现
 * @param  {string} file 输入文件路径名
 * @return {boolean}      正确格式返回 true
 */
function tryCodec(file) {
  try {
    var zip = new _admZip2.default(file);
    zip.zip;
  } catch (err) {
    if (err == _util2.default.Errors.INVALID_FILENAME) {
      return false;
    } else {
      throw err;
    }
  }

  return true;
}