'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = mixind;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _util = require('util');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _misc = require('../misc');

var _misc2 = _interopRequireDefault(_misc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixind(Composed) {

  return function (_Composed) {
    _inherits(_class2, _Composed);

    function _class2(opts) {
      _classCallCheck(this, _class2);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class2).call(this, opts));

      _this.state = "ready";
      return _this;
    }
    /**
     * status 状态机的状态配置
     *
     * @example
     *
     * const TaskStatus = ['running', 'done', 'ready', 'failed', 'timeout'];
     *
     * status = {
     *   "ready": [ 'running', 'done' ],
     *   "running": [ 'done', 'failed', 'timeout' ],
     *   "failed": [ 'running', 'done' ],
     *   "timeout": [ 'running', 'done' ]
     * };
     *
     * status Events 使用加 enter 或 leave  状态命名规则的 方法来达到响应事件。
     * 如
     *   enterRunning (data) {
     *     ....
     *   }
     *
     */


    _createClass(_class2, [{
      key: 'transitionTo',
      value: function transitionTo(state, data) {
        var _this2 = this;

        var status = this.status;

        var availableTargetStates = status[this.state] ? status[this.state] : status['*'] || [];

        var inState = !! ~availableTargetStates.indexOf(state);
        var camel = function camel() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return args.join(' ').toCamelCase();
        };

        (0, _assert2.default)(inState, 'Can\'t transition from ' + this.state + ' to ' + state);

        var enter = this[camel('enter', state)];
        var leave = this[camel('leave', this.state)];
        var trigger = function trigger(meth) {
          for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
            args[_key2 - 1] = arguments[_key2];
          }

          return meth.call.apply(meth, [_this2].concat(args));
        };

        if ((0, _util.isFunction)(leave)) {
          trigger(leave, data);
        }

        this.state = state;

        if ((0, _util.isFunction)(enter)) {
          trigger(enter, data);
        }

        return true;
      }
    }, {
      key: 'getState',
      value: function getState() {
        return this.state;
      }
    }]);

    return _class2;
  }(Composed);
}