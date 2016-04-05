'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;
exports.extractStream = extractStream;
exports.tryCodec = tryCodec;

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _util = require('adm-zip/util');

var _util2 = _interopRequireDefault(_util);

var _bluebird = require('bluebird');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extract = (0, _bluebird.promisify)(function extractSync(from, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? { overwrite: true } : arguments[2];
  var cb = arguments[3];

  console.log(from);

  var zip = new _admZip2.default(from);
  var overwrite = opts.overwrite;


  zip.extractAllToAsync(to, overwrite, cb);
});

var extract = exports.extract = extract;

function extractStream(from, to) {}

/**
 * try 尝试验证 zip 文件方法，必须实现
 * @param  {string} file 输入文件路径名
 * @return {boolean}      正确格式返回 true
 */
function tryCodec(file) {
  try {
    var zip = new _admZip2.default(file);
  } catch (err) {
    if (err == _util2.default.Errors.INVALID_FILENAME) {
      return false;
    } else {
      throw err;
    }
  }

  return true;
}