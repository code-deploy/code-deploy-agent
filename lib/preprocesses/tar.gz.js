'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;
exports.extractStream = extractStream;
exports.tryCodec = tryCodec;

var _tar = require('tar.gz');

var _tar2 = _interopRequireDefault(_tar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extract = exports.extract = (0, _tar2.default)().extract;

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