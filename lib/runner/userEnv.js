'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userEnv = userEnv;

var _child_process = require('child_process');

function userEnv(user) {
  var _spawnSync = (0, _child_process.spawnSync)('sudo', ['-iHu', user, 'env']);

  var output = _spawnSync.output;

  var lines = output.toString().split('\n');
  var results = {};
  lines.forEach(function (line) {
    var pos = line.indexOf('=');
    if (pos > 0) {
      var name = line.slice(0, pos);
      var value = line.slice(pos + 1);
      results[name] = value;
    }
  });

  return results;
}