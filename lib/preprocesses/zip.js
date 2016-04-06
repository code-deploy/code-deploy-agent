'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extract = undefined;
exports.extractStream = extractStream;
exports.tryCodec = tryCodec;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _admZip = require('adm-zip');

var _admZip2 = _interopRequireDefault(_admZip);

var _buckle = require('buckle');

var _buckle2 = _interopRequireDefault(_buckle);

var _unzip = require('unzip');

var _unzip2 = _interopRequireDefault(_unzip);

var _util = require('adm-zip/util');

var _util2 = _interopRequireDefault(_util);

var _bluebird = require('bluebird');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extract = (0, _bluebird.promisify)(function extractSync(from, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? { overwrite: true } : arguments[2];
  var cb = arguments[3];

  _logger2.default.info('Zip starting extract all files to ' + to + '...');

  var zip = new _admZip2.default(from);
  var overwrite = opts.overwrite;


  zip.extractAllToAsync(to, overwrite, function () {
    _logger2.default.info('Zip extract all files done');
    cb.apply(undefined, arguments);
  });
});

function extractZip(zip, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var cb = arguments[3];

  _fs2.default.createReadStream(zip).pipe(_unzip2.default.Parse()).on('entry', function (entry) {
    var fileName = entry.path;
    var type = entry.type; // 'Directory' or 'File'
    var size = entry.size;
    console.log(entry);
    if (fileName === "this IS the file I'm looking for") {
      entry.pipe(_fs2.default.createWriteStream(to));
    } else {
      entry.autodrain();
    }
  });
}

function buckleExtract(zip, to) {
  var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
  var cb = arguments[3];

  _buckle2.default.open(zip, to, cb);
}

var extract = exports.extract = (0, _bluebird.promisify)(buckleExtract);

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