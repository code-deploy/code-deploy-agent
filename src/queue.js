import Task from './task';

class Queue {
  tasks = [];

  next() {
    var task = this.tasks[0];
    
    if (task) {
      if (task.isRunning()) {
        return task;
      } else if (task.isReady()) {
        return task;
      } else if (task.isDone()) {
        this.tasks.shift();
        return task;
      } else if (task.isTimeout()) {
        this.tasks.shift();
        return task;
      } else if (task.isFailed()) {
        this.tasks.shift();
        return task;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  push(task) {
    return this.tasks.push(task);
  }
}

export default Queue;