'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _class, _desc, _value, _class2;

exports.create = create;
exports.validFormat = validFormat;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _mkdirp3 = require('mkdirp');

var _mkdirp4 = _interopRequireDefault(_mkdirp3);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _misc = require('../misc');

var _fileType = require('./fileType');

var fileType = _interopRequireWildcard(_fileType);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _preprocesses = require('../preprocesses');

var preprocesses = _interopRequireWildcard(_preprocesses);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mixin_task = require('./mixin_task');

var _runner = require('../runner');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

var _mkdirp2 = _bluebird2.default.promisify(_mkdirp4.default);

var LocalSource = (_dec = (0, _runner.runnify)('../runner/source.js'), (0, _mixin_task.mixTask)(_class = (_class2 = function (_Source) {
  _inherits(LocalSource, _Source);

  function LocalSource() {
    _classCallCheck(this, LocalSource);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LocalSource).apply(this, arguments));
  }

  _createClass(LocalSource, [{
    key: 'read',
    value: function read() {
      var _this2 = this;

      return _bluebird2.default.all([this.mkdirp().timeout((0, _misc.s)(3)), this.preprocessing().timeout(_config2.default.preprocesses.maxTime)]).then(function () {
        // this.taskTransitionTo('done');
      }).catch(_bluebird2.default.TimeoutError, function (err) {
        _this2.taskTransitionTo('timeout');
      }).catch(function (err) {
        _this2.taskClearTimeout();
        _this2.taskTransitionTo('error', err);
      });
    }
  }, {
    key: 'mkdirp',
    value: function mkdirp() {
      return _mkdirp2(this.targetDir);
    }
  }, {
    key: 'preprocessing',
    value: function preprocessing() {
      var preprocess;

      if (this.fileType) {
        preprocess = preprocesses[this.fileType];
      } else {
        preprocess = preprocesses.try(this.source);
      }

      (0, _assert2.default)(preprocess, 'Invalid preprocess type in this source ' + this.source);

      return preprocess.extract(this.source, this.targetDir, { overwrite: true });
    }
  }]);

  return LocalSource;
}(_source2.default), (_applyDecoratedDescriptor(_class2.prototype, 'read', [_dec], Object.getOwnPropertyDescriptor(_class2.prototype, 'read'), _class2.prototype)), _class2)) || _class);
var type = exports.type = 'local';

function create(source, opts) {
  return new LocalSource(source, opts);
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