import AWS from 'aws-sdk';

import config from '../config';
import Trigger from '../trigger';
import log from '../logger'
// import SQS from 'aws-sqs'

const { accessKeyId, secretAccessKey, region, endpoint} = config.sqs;
const apiVersion = '2012-11-05';

const QueueName = 'test-deploy-agent';

// AWS.config = new AWS.Config({
//   accessKeyId,
//   secretAccessKey,
//   region
// });

class SqsTrigger extends Trigger {

  constructor (options) {
    super(null);

    this.sqs = new AWS.SQS({
      // endpoint,
      accessKeyId,
      secretAccessKey,
      region,
      apiVersion
    });
    // this.sqs = new SQS(awsId, secret, {
    //   region
    // });
    // console.log(this.sqs);
  }

  start () {
    var nameParams = {
      QueueName
    };

    var params = {
      AttributeNames: [
        'Policy | VisibilityTimeout | MaximumMessageSize | MessageRetentionPeriod | ApproximateNumberOfMessages | ApproximateNumberOfMessagesNotVisible | CreatedTimestamp | LastModifiedTimestamp | QueueArn | ApproximateNumberOfMessagesDelayed | DelaySeconds | ReceiveMessageWaitTimeSeconds | RedrivePolicy',
        /* more items */
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
        'trigger',
        /* more items */
      ],
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0
    };

    log.info('Starting subscribe SQS messages');

    this.sqs.createQueue(nameParams, (err, data) => {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        params['QueueUrl'] = data.QueueUrl;
        console.log(params);
        this.sqs.receiveMessage(params, (err, data) => {
          if (err) {
            console.log(err, err.stack);
          } else {
            console.log(data);           // successful response
          }
        });
      }

    });

  }
}


var trigger;

export default function createSQSTrigger(options) {
  trigger = new SqsTrigger(options);

  trigger.start();
  return trigger;
};
