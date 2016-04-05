"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runnifyFile = runnifyFile;
exports.runnify = runnify;
function runnifyFile(file) {
  console.log(file);

  return function decorator(target, name, descriptor) {
    console.log(name, target, descriptor);
    return descriptor;
  };
}

function runnify(target) {
  return function (target) {
    return target;
  };
}