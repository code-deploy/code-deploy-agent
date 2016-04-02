import { TaskBase } from './base';
import { featureSource } from './source';
import { featureMeta } from './meta';

// export function factory(opts, from) {
//   // var task = new Task(opts);
//   var Factory;

//   Factory = MetFeature(Task);
//   Factory = SourceFeature(Factory);
//   console.log(Factory)
//   return Factory;
// }

@featureSource
@featureMeta
export class Task extends TaskBase {

}

export function createTask(opts, from ) {
  return new Task(opts);
}
