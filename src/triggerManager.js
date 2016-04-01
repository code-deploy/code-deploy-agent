import EventEmitter from 'events';
import { createHttpTrigger } from './triggers';

class TriggerManager extends EventEmitter {
  triggers = {
    http: createHttpTrigger()
  };

  constructor () {
    super()
    
    this.bindAllEvents({
      command: function(command) {

      }
    })
  }

  bindAllEvents (events) {
    for (var key in this.triggers) {
      var trigger = this.triggers[key];
      for (var name in events) {
        var handle = events[name];
        trigger.on(name, handle);
      }
    }
  }
}

function triggerManager() {
  return new TriggerManager();  
}

export {
  triggerManager
}
