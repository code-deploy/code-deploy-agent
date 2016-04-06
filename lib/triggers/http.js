'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createHttpTrigger;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _queue = require('../queue');

var queue = _interopRequireWildcard(_queue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var app = (0, _express2.default)();

var HttpTrigger = function (_Trigger) {
  _inherits(HttpTrigger, _Trigger);

  function HttpTrigger(httpOptions) {
    _classCallCheck(this, HttpTrigger);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HttpTrigger).call(this, null));

    if (typeof httpOptions === 'undefined') {
      httpOptions = {};
    }

    _this.options = _extends({}, httpOptions, {
      port: _config2.default.trigger.http.port
    });

    _this.server = (0, _express2.default)();

    _this._proxy(_this.server, 'get', 'post', 'route', 'use');
    _this.init();
    return _this;
  }

  _createClass(HttpTrigger, [{
    key: 'init',
    value: function init() {
      this.use(_bodyParser2.default.urlencoded({
        extended: true
      }));
      this.use(_bodyParser2.default.json());
      // post trigger
      this.post('/trigger', function (req, res) {
        var task = queue.createTask(req.body);

        res.json({
          state: 'created',
          task: {
            id: task.id,
            name: task.name,
            sourceType: task.sourceType,
            createdAt: task.meta.createdAt,
            updatedAt: task.meta.updatedAt
          }
        });
      });
    }
  }, {
    key: 'start',
    // event:
    value: function start() {
      this.server.listen(this.options.port);
    }
  }, {
    key: '_proxy',
    value: function _proxy(instance) {
      for (var _len = arguments.length, methods = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        methods[_key - 1] = arguments[_key];
      }

      for (var i = 0; i < methods.length; i++) {
        var meth = methods[i];

        this[meth] = function () {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          // var handle = args.pop();
          var method = instance[meth];

          return method.call.apply(method, [instance].concat(args));
          // return method.call(instance, ...args, handle.bind(this));
        };
      }
    }
  }]);

  return HttpTrigger;
}(_trigger2.default);

var trigger;

function createHttpTrigger(options) {
  trigger = new HttpTrigger(options);

  trigger.start();
  return trigger;
};