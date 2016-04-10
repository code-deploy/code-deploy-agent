import AWS from 'aws-sdk';
import util from 'util';
import Promise from 'bluebird';

import config from '../config';
import Trigger from '../trigger';
import log from '../logger';
import argv from '../argv';
import * as queue from '../queue';

// import SQS from 'aws-sqs'

const {accessKeyId, secretAccessKey, region} = config.sqs;
const apiVersion = '2012-11-05';

const QueueName = 'test-deploy-agent';

class SqsTrigger extends Trigger {

  /*eslint no-unused-vars: ["error", {"args": "none"}]*/
  constructor (options = {}) {
    super(null);

    this.sqs = Promise.promisifyAll(new AWS.SQS({
      // endpoint,
      accessKeyId,
      secretAccessKey,
      region,
      apiVersion
    }));

    this.QueueUrl = null;
  }

  start () {
    var nameParams = {
      QueueName
    };

    log.info('Starting subscribe SQS messages');

    this.sqs.createQueue(nameParams, (err, data) => {
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
    log.info(`ReceiveMessage '${QueueName}' at ${this.QueueUrl}`);

    this.sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
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

      return this.sqs.deleteMessageAsync({
        QueueUrl: this.QueueUrl,
        ReceiptHandle
      });
    })).then( results => {

      setImmediate(this.receiveMessage.bind(this));
    }).catch( err => {
      log.error(err, err.stack);
    });
  }

  onMessage(message) {
    var {MessageId, Body/*, ReceiptHandle, Body*/} = message;
    log.info(`Processing message ${MessageId}`);
    try {
      var data = JSON.parse(Body);
      var {trigger} = data;
      if (trigger) {
        queue.createTask(trigger);
      } else {
        throw new Error(`Invalid format ${util.inspect(data)}`);
      }
    } catch (err) {
      log.error(err, err.stack);
    }
  }
}


var trigger;

export default function createSQSTrigger(options) {
  trigger = new SqsTrigger(options);

  trigger.start();
  return trigger;
}
