'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class;

exports.createTask = createTask;

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _base = require('./base');

var _mixin_meta = require('./mixin_meta');

var _mixin_source = require('./mixin_source');

var _mixin_status = require('./mixin_status');

var _misc = require('../misc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// export function factory(opts, from) {
//   // var task = new Task(opts);
//   var Factory;

//   Factory = MetFeature(Task);
//   Factory = SourceFeature(Factory);
//   console.log(Factory)
//   return Factory;
// }

var Task = exports.Task = (0, _mixin_meta.mixMeta)(_class = (0, _mixin_source.mixSource)(_class = (0, _mixin_status.mixStatus)(_class = function (_TaskBase) {
  _inherits(Task, _TaskBase);

  function Task() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Task);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Task)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.status = {
      "ready": ['running', 'done'],
      "running": ['done', 'failed', 'timeout'],
      "failed": ['running', 'done'],
      "timeout": ['running', 'done']
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Task, [{
    key: 'start',
    value: function start() {
      this.transitionTo('running');
    }
  }, {
    key: 'stop',
    value: function stop() {
      this.transitionTo('stop');
    }
  }, {
    key: 'kill',
    value: function kill() {
      _logger2.default.warn(_util2.default.format("killing Task :%s", this.id));
    }
  }, {
    key: 'enterRunning',
    value: function enterRunning() {
      var _this2 = this;

      this.delay((0, _misc.s)(3), function () {
        return _this2.transitionTo('timeout');
      });
    }
  }, {
    key: 'enterTimeout',
    value: function enterTimeout() {
      this.kill();
    }
  }, {
    key: 'delay',
    value: function delay(time, cb) {
      this.setMeta('expiredAt', time);
      this._clearTimeout();

      this.expiredHandle = setTimeout(cb, Date.now() + time);
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

  return Task;
}(_base.TaskBase)) || _class) || _class) || _class;

function createTask(opts, from) {
  return new Task(opts);
}