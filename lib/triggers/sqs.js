'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createSQSTrigger;

var _trigger = require('../trigger');

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _awsSqs = require('aws-sqs');

var _awsSqs2 = _interopRequireDefault(_awsSqs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _config$sqs = _config2.default.sqs;
var awsId = _config$sqs.awsId;
var secret = _config$sqs.secret;

var SqsTrigger = function (_Trigger) {
  _inherits(SqsTrigger, _Trigger);

  function SqsTrigger(options) {
    _classCallCheck(this, SqsTrigger);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SqsTrigger).call(this, null));

    _this.sqs = new _awsSqs2.default(awsId, secret);
    console.log(_this.sqs);
    return _this;
  }

  _createClass(SqsTrigger, [{
    key: 'start',
    value: function start() {
      this.sqs.createQueue('testTimeoutQueue', { VisibilityTimeout: 120 }, function (err, res) {
        if (err) {
          //handle error
        }
        console.log(res); // something like /158795553855/testTimeoutQueue
      });
    }
  }]);

  return SqsTrigger;
}(_trigger.Trigger);

var trigger;

function createSQSTrigger(options) {
  trigger = new SqsTrigger(options);

  trigger.start();
  return trigger;
};