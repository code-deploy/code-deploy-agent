export function runnifyFile(file) {
  console.log(file);

  return function decorator(target, name, descriptor) {
    console.log(name, target, descriptor);
    return descriptor
  };
}


export function runnify(target) {
  return function (target) {
    return target;
  }
}
