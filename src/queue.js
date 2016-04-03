import tasks from './tasks'

export class Queue {
  tasks = [];
  
  find(taskId) {
    for (var i = 0; i < this.tasks.length; i++) {
      var task = this.tasks[i];
      if (task && (task.id === taskId || task === taskId)) {
        return task;
      }
    }  
    return null;
  }

  push(task) {
    return this.tasks.push(task);
  }
}

export var taskPool = new Queue;

export function createTask(options) {
  var task = tasks.createTask(options);

  taskPool.push( task );
  return task;
}

// if (!taskPooler) { taskPooler = new Queue; }

