import express from 'express';
import bodyParser from 'body-parser';

import config from '../config';
import Trigger from '../trigger';
import * as queue from '../queue';

class HttpTrigger extends Trigger {

  constructor (httpOptions) {
    super(null);

    if (typeof httpOptions === 'undefined') { httpOptions = {}; }

    this.options = {
      ...httpOptions,
      port: config.trigger.http.port
    };

    this.server = express();

    this._proxy(this.server, 'get', 'post', 'route', 'use' );
    this.init();
  }

  init () {
    this.use(bodyParser.urlencoded({
      extended: true
    }));
    this.use(bodyParser.json());
    // post trigger
    this.post('/trigger', (req, res) => {
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

  start() {
    this.server.listen(this.options.port);
  }

  _proxy (instance, ...methods) {
    for (var i = 0; i < methods.length; i++ ) {
      var meth = methods[i];

      this[meth] = (...args) => {
        // var handle = args.pop();
        var method = instance[meth];

        return method.call(instance, ...args);
        // return method.call(instance, ...args, handle.bind(this));
      };
    }
  }
}

var trigger;

export default function createHttpTrigger(options) {
  trigger = new HttpTrigger(options);

  trigger.start();
  return trigger;
}
