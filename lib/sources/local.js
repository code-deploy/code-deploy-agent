'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.create = create;
exports.validFormat = validFormat;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fileType = require('./fileType');

var fileType = _interopRequireWildcard(_fileType);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _preprocesses = require('../preprocesses');

var _preprocesses2 = _interopRequireDefault(_preprocesses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var incomingDir = _path2.default.join(_config2.default.workDir, 'incoming/local');

var LocalSource = function (_Source) {
  _inherits(LocalSource, _Source);

  function LocalSource(source) {
    _classCallCheck(this, LocalSource);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LocalSource).call(this));

    _this.id = _nodeUuid2.default.v1();
    _this.targetDir = _path2.default.join(incomingDir, _this.id);
    _this.source = source;
    _this.fileType = fileType.check(source);
    return _this;
  }

  _createClass(LocalSource, [{
    key: 'read',
    value: function read() {
      _mkdirp2.default.sync(this.targetDir);

      this.preprocessing();

      return this.targetDir;
    }
  }, {
    key: 'preprocessing',
    value: function preprocessing() {
      var preprocess;
      if (this.fileType) {
        preprocess = _preprocesses2.default[this.fileType];
      } else {
        preprocess = _preprocesses2.default.try(this.source);
      }

      assert(preprocess, 'Invalid preprocess type in this source ' + this.source);

      preprocess.extract(this.source, this.targetDir);
    }
  }]);

  return LocalSource;
}(_source2.default);

var type = exports.type = 'local';

function create(source, opts) {
  return new LocalSource(source);
}

function validFormat(file) {
  try {
    _fs2.default.accessSync(file, _fs2.default.F_OK);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }

  return true;
}