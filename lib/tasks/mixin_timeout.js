'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.mixTimeout = mixTimeout;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixTimeout(Composed) {

  return function (_Composed) {
    _inherits(_class, _Composed);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, Object.getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: 'delay',
      value: function delay(time, cb) {
        this.setMeta('expiredAt', time);
        this._clearTimeout();

        this.expiredHandle = setTimeout(cb, time);
        _logger2.default.info(_util2.default.format('Task %s set timeout delay %d millseconds', this.id, time));
      }
    }, {
      key: 'delayAt',
      value: function delayAt(time, cb) {
        this.delay(time - Date.now(), cb);
      }
    }, {
      key: '_clearTimeout',
      value: function _clearTimeout() {
        if (this.expiredHandle) {
          clearTimeout(this.expiredHandle);
        }
      }
    }]);

    return _class;
  }(Composed);
}