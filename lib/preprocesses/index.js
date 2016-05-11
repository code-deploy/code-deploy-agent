'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.targz = exports.zip = undefined;
exports.tryCodec = tryCodec;

var _zip = require('./zip');

var zip = _interopRequireWildcard(_zip);

var _tar = require('./tar.gz');

var targz = _interopRequireWildcard(_tar);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.zip = zip;
exports.targz = targz;
function tryCodec(file) {
  var codecs = [zip, targz];

  for (var codec in codecs) {
    if (codec.tryCodec(file)) {
      return codec;
    }
  }

  return null;
}