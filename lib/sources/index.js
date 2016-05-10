'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _local = require('./local');

var local = _interopRequireWildcard(_local);

var _s = require('./s3');

var s3 = _interopRequireWildcard(_s);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
  local: local,
  s3: s3
};