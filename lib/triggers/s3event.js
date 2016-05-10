'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.S3EventTrigger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = createS3EventTrigger;

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

var S3EventTrigger = exports.S3EventTrigger = function (_Trigger) {
  _inherits(S3EventTrigger, _Trigger);

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/

  function S3EventTrigger() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, S3EventTrigger);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(S3EventTrigger).call(this, null));

    _this.options = options;
    var _this$options = _this.options;
    var accessKeyId = _this$options.accessKeyId;
    var secretAccessKey = _this$options.secretAccessKey;
    var region = _this$options.region;
    var queueName = _this$options.queueName;

    _this.name = options.name;
    _this.accessKeyId = accessKeyId;
    _this.secretAccessKey = secretAccessKey;
    _this.region = region;
    _this.QueueName = queueName;

    _this._sqs = _bluebird2.default.promisifyAll(new _awsSdk2.default.SQS({
      // endpoint,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      apiVersion: apiVersion
    }));

    _this.QueueUrl = null;
    return _this;
  }

  _createClass(S3EventTrigger, [{
    key: 'start',
    value: function start() {
      var _this2 = this;

      var QueueName = this.QueueName;

      var nameParams = {
        QueueName: QueueName
      };

      _logger2.default.info('Starting subscribe SQS messages');

      this.sqs().createQueue(nameParams, function (err, data) {
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
      _logger2.default.info('ReceiveMessage \'' + this.QueueName + '\' at ' + this.QueueUrl + ' by s3event');

      this.sqs().receiveMessage(params, function (err, data) {
        if (err) {
          _this3.clear();
          console.log(err, err.stack);
          setTimeout(_this3.receiveMessage.bind(_this3), 1000);
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


        return _this4.sqs().deleteMessageAsync({
          QueueUrl: _this4.QueueUrl,
          ReceiptHandle: ReceiptHandle
        });
      })).then(function (results) {

        setImmediate(_this4.receiveMessage.bind(_this4));
      }).catch(function (err) {
        _this4.clear();
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
        (function () {
          var data = JSON.parse(Body);
          var Records = data.Records;


          Records.forEach(function (record) {
            var trigger = parseS3(record.s3);
            if (trigger) {
              queue.createTask(trigger);
            } else {
              throw new Error('Invalid format ' + _util2.default.inspect(data));
            }
          });
        })();
      } catch (err) {
        _logger2.default.error(err, err.stack);
      }
    }
  }, {
    key: 'sqs',
    value: function sqs() {
      var _options = this.options;
      var accessKeyId = _options.accessKeyId;
      var secretAccessKey = _options.secretAccessKey;
      var region = _options.region;


      if (!this._sqs) {
        this._sqs = _bluebird2.default.promisifyAll(new _awsSdk2.default.SQS({
          // endpoint,
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
          region: region,
          apiVersion: apiVersion
        }));
      }

      return this._sqs;
    }
  }, {
    key: 'clear',
    value: function clear() {
      this._sqs = null;
    }
  }]);

  return S3EventTrigger;
}(_trigger2.default);

// sample json schema
// { s3SchemaVersion: '1.0',
//   configurationId: 'AppDeployForPut',
//   bucket:
//    { name: 'wxapps',
//      ownerIdentity: { principalId: 'AWS:560397965647' },
//      arn: 'arn:aws:s3:::wxapps' },
//   object:
//    { key: 'deploy-piano-server-1462778270.tar.gz',
//      size: 27019491,
//      eTag: 'cdbefd32d6475e3695de7364d5de801f-4',
//      sequencer: '00573039A07A0D6184' } }


function parseS3(s3) {
  return {
    name: s3.configurationId,
    event: s3.configurationId,
    source: 's3://' + s3.bucket.name + '/' + s3.object.key,
    size: s3.object.size,
    eTag: s3.object.eTag
  };
}

var trigger;

function createS3EventTrigger(options) {
  trigger = new S3EventTrigger(options);

  trigger.start();
  return trigger;
}