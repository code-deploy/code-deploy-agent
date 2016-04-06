import assert from 'assert';
import path from 'path';
import { fork } from 'child_process';
import { decorate } from '../misc';

const DEFAULT_MSG = 'This function running in child process...';

function handleDescriptor(target, key, descriptor, [filename]) {
  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be runnify');
  }

  const methodSignature = `${target.constructor.name}#${key}`;

  assert(filename, 'Must specify runner filename in arguments');

  return {
    ...descriptor,
    value: function runnifyWrapper() {
      // var data = JSON.stringify(this);
      console.log(this);

      return new Promise((resolve, reject) => {
        var child = fork(path.join(__dirname, 'runner.js'), [filename, methodSignature], {timeout: 20});

        child.on('exit', (code) => {
          resolve(code);
        });

        child.on('close', (code) => {
          resolve(code);
        });
      });
    }
  };
}

export function runnify(...args) {
  return decorate(handleDescriptor, args);
}
