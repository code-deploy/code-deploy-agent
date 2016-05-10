'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.LocalSource = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;
// import {runnify} from '../runner';


exports.create = create;
exports.validFormat = validFormat;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mixins = require('../mixins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LocalSource = exports.LocalSource = (_dec = (0, _mixins.mixin)('task'), _dec2 = (0, _mixins.mixin)('marshal'), _dec(_class = _dec2(_class = function (_Source) {
  _inherits(LocalSource, _Source);

  function LocalSource() {
    _classCallCheck(this, LocalSource);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(LocalSource).apply(this, arguments));
  }

  _createClass(LocalSource, [{
    key: 'read',
    value: function read() {
      var _this2 = this;

      return _bluebird2.default.all([this.mkdirp(), this.preprocessing().timeout(_config2.default.preprocesses.maxTime)]).then(function () {
        // this.taskTransitionTo('done');
      }).catch(_bluebird2.default.TimeoutError, function (err) {
        _this2.taskTransitionTo('timeout');
        _logger2.default.error(err, err.stack);
      }).catch(function (err) {
        _this2.taskClearTimeout();
        _this2.taskTransitionTo('error', err);
      });
    }
  }]);

  return LocalSource;
}(_source2.default)) || _class) || _class);
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