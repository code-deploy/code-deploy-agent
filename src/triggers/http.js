import express from 'express';
import util from 'util';
import bodyParser from 'body-parser';

import config from '../config';
import Trigger from '../trigger';
import * as queue from '../queue';

const app = express();

class HttpTrigger extends Trigger {

  constructor (httpOptions) {
    super(null);

    if (typeof httpOptions === 'undefined') { httpOptions = {}; }

    this.options = util._extend(httpOptions, {
      port: config.trigger.http.port
    });

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
      // try {
        console.log(typeof req.body, req.body, Object.keys(req.body));
        var task = queue.createTask(req.body);

        res.json({
          state: 'success'
        });

      // } catch (err) {
      //   res.er        
      // }
    })
  }

  start() {
    this.server.listen(this.options.port)
  }

  _proxy (instance, ...methods) {
    for (var i = 0; i < methods.length; i++ ) {
      var meth = methods[i];

      this[meth] = (...args) => {
        // var handle = args.pop();
        var method = instance[meth]

        return method.call(instance, ...args);
        // return method.call(instance, ...args, handle.bind(this));
      }
    }
  }
}

var trigger; 

export default function createHttpTrigger(options) {
  trigger = new HttpTrigger(options);

  trigger.start();
  return trigger;
};
