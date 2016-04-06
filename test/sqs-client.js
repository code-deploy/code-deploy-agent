import AWS from 'aws-sdk';
import util from 'util';
import Promise from 'bluebird';

import config from '../src/config';

const { accessKeyId, secretAccessKey, region, endpoint} = config.sqs;
const apiVersion = '2012-11-05';

const QueueName = 'deploy-agent';

var sqs = new AWS.SQS({
  // endpoint,
  accessKeyId,
  secretAccessKey,
  region,
  apiVersion
});

var argv = process.argv.slice(2);
const QueueUrl = argv[0];
var body = JSON.parse(argv[1]);

//{"name": "test", "source": "examples/deploy.zip"}'
function hashToAttributes(hash) {
  var results = {};

  for (var key in hash) {
    var value = hash[key];
    results[key] = attributeItem(key, value);
  }

  return results;
}


function attributeItem(key, value) {
  const type = ofType(value);
  const name = valueOfName(type, value);
  var item = {
    DataType: type,
  }

  item[name] = value
  return item;
}

// String, Number, and Binary
function ofType(value) {
  if (util.isString(value)) {
    return 'String';
  } else if (util.isNumber(value)) {
    return 'Number';
  } else if (util.isBuffer(value)) {
    return 'Binary';
  }
}

function valueOfName(type, value) {
  switch(type) {
  case 'String':
  case 'Number':
    return 'StringValue';
  case 'Binary':
    return 'BinaryValue';
  }
}
console.log(sqs.sendMessage);

sqs = Promise.promisifyAll(sqs);

var params = {
  MessageBody: 'trigger', /* required */
  QueueUrl: QueueUrl, /* required */
  DelaySeconds: 0,
  MessageAttributes: hashToAttributes(body)
};

sqs.sendMessageAsync(params)
// }).then(result => {
//   var params = {
//     Entries: [ /* required */
//       {
//         Id: result.MessageId, /* required */
//         ReceiptHandle: 'STRING_VALUE',  required
//         VisibilityTimeout: 0
//       },
//       /* more items */
//     ],
//     QueueUrl: 'STRING_VALUE' /* required */
//   };
//   return sqs.changeMessageVisibilityBatch(params);
.then(result => {
  console.log(result);
}).catch(err => {
  console.log(err, err.stack);
});


// sqs.sendMessage(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });

// var params = {
//   Entries: [ /* required */
//     {
//       Id: 'STRING_VALUE', /* required */
//       ReceiptHandle: 'STRING_VALUE',  required
//       VisibilityTimeout: 0
//     },
//     /* more items */
//   ],
//   QueueUrl: 'STRING_VALUE' /* required */
// };

// sqs.changeMessageVisibilityBatch(params, function(err, data) {
//   if (err) console.log(err, err.stack); // an error occurred
//   else     console.log(data);           // successful response
// });
