import express from 'express';
import util from 'util';

import Trigger from '../trigger';

const app = express();

class HttpTrigger extends Trigger {

  constructor (httpOptions) {
    super(null);

    if (typeof httpOptions === 'undefined') { httpOptions = {}; }

    this.options = util._extend(httpOptions, {
      port: 8040
    });

    this.server = express();

    this._proxy(this.server, 'get', 'post', 'route', 'use' );
    this.init();
  }

  init () {
    // post trigger 
    this.post('trigger', (req, res) => {
      res.json({
        state: 'success'
      });
    });
  }

  start() {
    this.server.listen(this.options.port)
  }

  _proxy (instance, ...methods) {
    for (var i = 0; i < methods.length; i++ ) {
      var meth = methods[i];

      this[meth] = (...args) => {
        var handle = args.pop();
        var method = instance[meth]

        return method.call(instance, ...args, handle.bind(this));
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
