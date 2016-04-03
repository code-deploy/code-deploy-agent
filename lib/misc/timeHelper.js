"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.s = s;
exports.minute = minute;
exports.hour = hour;
function s(second) {
  return second * 1000;
}

function minute(min) {
  return min * s(60);
}

function hour(h) {
  return h * minute(60);
}