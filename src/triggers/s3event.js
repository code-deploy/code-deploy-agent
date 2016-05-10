import AWS from 'aws-sdk';
import util from 'util';
import Promise from 'bluebird';

import Trigger from '../trigger';
import log from '../logger';
import argv from '../argv';
import * as queue from '../queue';

// import SQS from 'aws-sqs'
/**
 * SQS 工作方式 https://docs.aws.amazon.com/zh_cn/AWSSimpleQueueService/latest/SQSGettingStartedGuide/ReceiveMessage.html
 *
 * WaitTimeSeconds 为 0 的时候，是短轮询，你需要不断的查询列队，才能获取信息
 * 我们现在采用的是长轮询，时间为 20 s, 每 20 s 要去 poll 一次。
 */

const apiVersion = '2012-11-05';

export class S3EventTrigger extends Trigger {

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/
  constructor (options = {}) {
    super(null);

    this.options = options;
    const {accessKeyId, secretAccessKey, region, queueName} = this.options;
    this.name = options.name;
    this.accessKeyId = accessKeyId;
    this.secretAccessKey = secretAccessKey;
    this.region = region;
    this.QueueName = queueName;

    this._sqs = Promise.promisifyAll(new AWS.SQS({
      // endpoint,
      accessKeyId,
      secretAccessKey,
      region,
      apiVersion
    }));

    this.QueueUrl = null;
  }

  start () {
    const {QueueName} = this;
    const nameParams = {
      QueueName
    };

    log.info('Starting subscribe SQS messages');

    this.sqs().createQueue(nameParams, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        this.QueueUrl = data.QueueUrl;

        if (argv.verboseSqsUrl) {
          console.log(data.QueueUrl);
        }

        this.receiveMessage();
      }
    });
  }

  receiveMessage () {
    var params = {
      AttributeNames: [
        'Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy'
        /* more items */
      ],
      MaxNumberOfMessages: 1,
      MessageAttributeNames: [
        'trigger'
        /* more items */
      ],
      VisibilityTimeout: 0,
      WaitTimeSeconds: 20
    };

    params['QueueUrl'] = this.QueueUrl;
    log.info(`ReceiveMessage '${this.QueueName}' at ${this.QueueUrl} by s3event`);

    this.sqs().receiveMessage(params, (err, data) => {
      if (err) {
        this.clear();
        console.log(err, err.stack);
        setTimeout(this.receiveMessage.bind(this), 1000);
      } else {
        var {Messages} = data;
        if (util.isArray(Messages)) {
          Messages.forEach(this.onMessage.bind(this));
          this.deletedMessages(Messages);
        } else {
          setImmediate(this.receiveMessage.bind(this));
        }
      }
    });
  }

  deletedMessages(messages) {

    Promise.all(messages.map( message => {
      var {ReceiptHandle} = message;

      return this.sqs().deleteMessageAsync({
        QueueUrl: this.QueueUrl,
        ReceiptHandle
      });
    })).then( results => {

      setImmediate(this.receiveMessage.bind(this));
    }).catch( err => {
      this.clear();
      log.error(err, err.stack);
    });
  }

  onMessage(message) {
    var {MessageId, Body/*, ReceiptHandle, Body*/} = message;
    log.info(`Processing message ${MessageId}`);
    try {
      let data = JSON.parse(Body);
      let {Records} = data;

      Records.forEach(function(record) {
        let trigger = parseS3(record.s3);
        if (trigger) {
          queue.createTask(trigger);
        } else {
          throw new Error(`Invalid format ${util.inspect(data)}`);
        }
      });
    } catch (err) {
      log.error(err, err.stack);
    }
  }

  sqs () {
    const {accessKeyId, secretAccessKey, region} = this.options;

    if (!this._sqs) {
      this._sqs = Promise.promisifyAll(new AWS.SQS({
        // endpoint,
        accessKeyId,
        secretAccessKey,
        region,
        apiVersion
      }));
    }

    return this._sqs;
  }

  clear() {
    this._sqs = null;
  }
}


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
    source: `s3://${s3.bucket.name}/${s3.object.key}`,
    size: s3.object.size,
    eTag: s3.object.eTag
  };
}


var trigger;

export default function createS3EventTrigger(options) {
  trigger = new S3EventTrigger(options);

  trigger.start();
  return trigger;
}
