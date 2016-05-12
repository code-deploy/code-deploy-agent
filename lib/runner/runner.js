'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _userid = require('userid');

var _userid2 = _interopRequireDefault(_userid);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _child_process = require('child_process');

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _copy = require('./copy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));
var deployFile = _path2.default.join(argv.dir, argv.file);

try {
  var deploy = _jsYaml2.default.safeLoad(_fsExtra2.default.readFileSync(deployFile, 'utf8'));

  (0, _assert2.default)(deploy.target, 'Deploy file must have spectify target');

  var user = deploy.owner;
  var group = deploy.group || user;
  var runOtps = {
    cwd: deploy.target
  };

  if (user) {
    runOtps.uid = _userid2.default.uid(user);
  }

  if (group) {
    runOtps.gid = _userid2.default.gid(group);
  }

  (0, _copy.copy)(argv.dir, deploy.target, runOtps);

  if (deploy.script) {
    var runner = (0, _child_process.spawn)(deploy.script, [], runOtps);

    runner.stdout.on('data', function (data) {
      _logger2.default.info('stdout: ' + data);
    });

    runner.stderr.on('data', function (data) {
      _logger2.default.error('stderr: ' + data);
    });

    runner.on('close', function (code) {
      _logger2.default.info('child process exited with code ' + code);
    });
  }
} catch (err) {
  _logger2.default.error(err);
}