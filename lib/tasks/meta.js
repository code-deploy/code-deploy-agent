'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FactoryMeta = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _task = require('../task');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MetaInfo = ["createdAt", "updatedAt", "startAt", "endAt"];

var FactoryMeta = exports.FactoryMeta = function FactoryMeta(Factory) {
  return function (_Task) {
    _inherits(_class, _Task);

    function _class(opts) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, opts));

      Factory.call(_this, opts);

      _this.meta = {};
      _this.meta.createdAt = new Date();
      _this.meta.updatedAt = _this.meta.createdAt;
      _this.meta.stepTimeout = opts.stepTimeout || _config2.default.stepTimeout;
      return _this;
    }

    _createClass(_class, [{
      key: 'setMeta',
      value: function setMeta(key, value) {
        if (!!MetaInfo.indexOf(key)) {
          this.meta[key] = value;
        }
      }
    }, {
      key: 'getMeta',
      value: function getMeta(key) {
        if (!!MetaInfo.indexOf(key)) {
          return this.meta[key];
        }
      }
    }]);

    return _class;
  }(_task.Task);
};