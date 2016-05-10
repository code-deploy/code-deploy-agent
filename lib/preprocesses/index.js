'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.zip = undefined;
exports.tryCodec = tryCodec;

var _zip = require('./zip');

var zip = _interopRequireWildcard(_zip);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.zip = zip;
function tryCodec(file) {
  var codecs = [zip];

  for (var codec in codecs) {
    if (codec.tryCodec(file)) {
      return codec;
    }
  }

  return null;
}