'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.triggerManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _triggers = require('./triggers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TriggerManager = function (_EventEmitter) {
  _inherits(TriggerManager, _EventEmitter);

  function TriggerManager() {
    _classCallCheck(this, TriggerManager);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TriggerManager).call(this));

    _this.triggers = {
      http: (0, _triggers.createHttpTrigger)()
    };


    _this.bindAllEvents({
      command: function command(_command) {}
    });
    return _this;
  }

  _createClass(TriggerManager, [{
    key: 'bindAllEvents',
    value: function bindAllEvents(events) {
      for (var key in this.triggers) {
        var trigger = this.triggers[key];
        for (var name in events) {
          var handle = events[name];
          trigger.on(name, handle);
        }
      }
    }
  }]);

  return TriggerManager;
}(_events2.default);

function triggerManager() {
  return new TriggerManager();
}

exports.triggerManager = triggerManager;