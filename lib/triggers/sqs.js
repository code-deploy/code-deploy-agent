'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SqsTrigger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createSQSTrigger;

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _trigger = require('../trigger');

var _trigger2 = _interopRequireDefault(_trigger);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _argv = require('../argv');

var _argv2 = _interopRequireDefault(_argv);

var _queue = require('../queue');

var queue = _interopRequireWildcard(_queue);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import SQS from 'aws-sqs'
/**
 * SQS 工作方式 https://docs.aws.amazon.com/zh_cn/AWSSimpleQueueService/latest/SQSGettingStartedGuide/ReceiveMessage.html
 *
 * WaitTimeSeconds 为 0 的时候，是短轮询，你需要不断的查询列队，才能获取信息
 * 我们现在采用的是长轮询，时间为 20 s, 每 20 s 要去 poll 一次。
 */

var apiVersion = '2012-11-05';

var SqsTrigger = exports.SqsTrigger = function (_Trigger) {
  _inherits(SqsTrigger, _Trigger);

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/

  function SqsTrigger() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, SqsTrigger);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SqsTrigger).call(this, null));

    var accessKeyId = options.accessKeyId;
    var secretAccessKey = options.secretAccessKey;
    var region = options.region;
    var queueName = options.queueName;

    _this.accessKeyId = accessKeyId;
    _this.secretAccessKey = secretAccessKey;
    _this.region = region;
    _this.QueueName = queueName;

    _this.sqs = _bluebird2.default.promisifyAll(new _awsSdk2.default.SQS({
      // endpoint,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      apiVersion: apiVersion
    }));

    _this.QueueUrl = null;
    return _this;
  }

  _createClass(SqsTrigger, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var QueueName = this.QueueName;

      var nameParams = {
        QueueName: QueueName
      };

      _logger2.default.info('Starting subscribe SQS messages');

      this.sqs.createQueue(nameParams, function (err, data) {
        if (err) {
          console.log(err, err.stack); // an error occurred
        } else {
            _this2.QueueUrl = data.QueueUrl;

            if (_argv2.default.verboseSqsUrl) {
              console.log(data.QueueUrl);
            }

            _this2.receiveMessage();
          }
      });
    }
  }, {
    key: 'receiveMessage',
    value: function receiveMessage() {
      var _this3 = this;

      var params = {
        AttributeNames: ['Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy'
        /* more items */
        ],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['trigger'
        /* more items */
        ],
        VisibilityTimeout: 0,
        WaitTimeSeconds: 20
      };

      params['QueueUrl'] = this.QueueUrl;
      _logger2.default.info('ReceiveMessage \'' + this.QueueName + '\' at ' + this.QueueUrl + ' by sqs');

      this.sqs.receiveMessage(params, function (err, data) {
        if (err) {
          console.log(err, err.stack);
        } else {
          var Messages = data.Messages;

          if (_util2.default.isArray(Messages)) {
            Messages.forEach(_this3.onMessage.bind(_this3));
            _this3.deletedMessages(Messages);
          } else {
            setImmediate(_this3.receiveMessage.bind(_this3));
          }
        }
      });
    }
  }, {
    key: 'deletedMessages',
    value: function deletedMessages(messages) {
      var _this4 = this;

      _bluebird2.default.all(messages.map(function (message) {
        var ReceiptHandle = message.ReceiptHandle;


        return _this4.sqs.deleteMessageAsync({
          QueueUrl: _this4.QueueUrl,
          ReceiptHandle: ReceiptHandle
        });
      })).then(function (results) {

        setImmediate(_this4.receiveMessage.bind(_this4));
      }).catch(function (err) {
        _logger2.default.error(err, err.stack);
      });
    }
  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      var MessageId = /*, ReceiptHandle, Body*/message.MessageId;
      var Body = message.Body;

      _logger2.default.info('Processing message ' + MessageId);
      try {
        var data = JSON.parse(Body);

        var trigger = data.trigger;

        if (trigger) {
          queue.createTask(trigger);
        } else {
          throw new Error('Invalid format ' + _util2.default.inspect(data));
        }
      } catch (err) {
        _logger2.default.error(err, err.stack);
      }
    }
  }]);

  return SqsTrigger;
}(_trigger2.default);

var trigger;

function createSQSTrigger(options) {
  trigger = new SqsTrigger(options);

  trigger.start();
  return trigger;
}