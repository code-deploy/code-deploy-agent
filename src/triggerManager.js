import EventEmitter from 'events';
import config from './config';
import {createHttpTrigger, createSQSTrigger, createS3EventTrigger} from './triggers';

class TriggerManager extends EventEmitter {
  static triggers = {
    http: createHttpTrigger()
  };

  constructor () {
    super();
    this.listeners = [];
    this.listeners.push(TriggerManager.triggers.http);

    for (let key in config.listeners) {
      let listen = config.listeners[key];
      if (listen.adapter) {
        if (listen.adapter == 'sqs') {
          // const {accessKeyId, secretAccessKey, region, queueName} = listen;
          this.listeners.push(createSQSTrigger(listen));
        } else if (listen.adapter == 's3event') {
          // const {accessKeyId, secretAccessKey, region, queueName} = listen;
          this.listeners.push(createS3EventTrigger(listen));
        }
      }
    }
    // this.bindAllEvents({
    //   command: function(command) {

    //   },
    //   kill: function(id) {

    //   }
    // })
  }

  bindAllEvents (events) {
    this.listeners.forEach(function(listen) {
      for (var name in events) {
        var handle = events[name];
        listen.on(name, handle);
      }
    });
  }
}

function triggerManager() {
  return new TriggerManager();
}

export {
  triggerManager
};
