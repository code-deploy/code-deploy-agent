'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = mixind;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mixind(Composed) {
  return function (_Composed) {
    _inherits(_class, _Composed);

    function _class(source, opts) {
      _classCallCheck(this, _class);

      // Composed.prototype.constructor.call(this, opts);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, source, opts));

      (0, _assert2.default)(opts.task, 'Must pass task argument in opts');
      _this.task = opts.task;
      return _this;
    }

    _createClass(_class, [{
      key: 'taskTransitionTo',
      value: function taskTransitionTo(state, data) {
        this.task.transitionTo(state, data);
      }
    }, {
      key: 'taskTimeout',
      value: function taskTimeout(time) {
        var _this2 = this;

        this.taskTimeoutWithFunc(time, function () {
          _this2.taskTransitionTo('timeout');
        });
      }
    }, {
      key: 'taskTimeoutWithFunc',
      value: function taskTimeoutWithFunc(time, cb) {
        this.task.delay(time, cb);
      }
    }, {
      key: 'taskClearTimeout',
      value: function taskClearTimeout() {
        this.task._clearTimeout();
      }
    }]);

    return _class;
  }(Composed);
}