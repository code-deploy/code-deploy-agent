'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _fileType = require('./fileType');

var fileType = _interopRequireWildcard(_fileType);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var incomingDir = _path2.default.join(_config2.default.workDir, 'incoming/local');

var Source = function () {
  function Source(source, opts) {
    _classCallCheck(this, Source);

    this.id = _nodeUuid2.default.v1();
    this.targetDir = _path2.default.join(incomingDir, this.id);
    this.source = source;
    this.fileType = fileType.check(source);
  }

  // pure function


  _createClass(Source, [{
    key: 'read',
    value: function read() {}
  }]);

  return Source;
}();

exports.default = Source;