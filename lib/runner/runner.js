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

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _promiseSerial = require('promise-serial');

var _promiseSerial2 = _interopRequireDefault(_promiseSerial);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _copy = require('./copy');

var _suspawn = require('./suspawn');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));

// import {spawn} from 'child_process';

var deployFile = _path2.default.join(argv.dir, argv.file);

try {
  var deploy;
  var before;
  var action;
  var after;

  (function () {
    deploy = _jsYaml2.default.safeLoad(_fsExtra2.default.readFileSync(deployFile, 'utf8'));


    (0, _assert2.default)(deploy.target, 'Deploy file must have spectify target');

    var user = deploy.owner;
    var group = typeof deploy.group !== 'undefined' ? deploy.group : user;
    var runOtps = {
      cwd: deploy.target
    };

    _logger2.default.info('deploy config', deploy);
    _logger2.default.info('runas user ' + user + ' and group ' + group);

    if (user) {
      runOtps.uid = _userid2.default.uid(user);
      _logger2.default.info('runas command as ' + user + ' of ' + runOtps.uid);
    }

    if (group) {
      runOtps.gid = _userid2.default.gid(group);
    }

    before = new _bluebird2.default(function (resolve) {
      if (deploy.before) {
        runScript(deploy.before, user, [], runOtps, resolve);
      } else {
        resolve();
      }
    });
    action = new _bluebird2.default(function (resolve) {
      (0, _copy.copy)(argv.dir, deploy.target, runOtps);

      if (deploy.script) {
        var runner = (0, _suspawn.sudoSpawn)(deploy.script, user, [], runOtps);

        runner.stdout.on('data', function (data) {
          _logger2.default.info('stdout: ' + data);
        });

        runner.stderr.on('data', function (data) {
          _logger2.default.error('stderr: ' + data);
        });

        runner.on('close', function (code) {
          _logger2.default.info('child process exited with code ' + code);
          resolve();
        });
      } else {
        resolve('not deploy script');
      }
    });
    after = new _bluebird2.default(function (resolve) {
      if (deploy.after) {
        runScript(deploy.after, user, [], runOtps, resolve);
      } else {
        resolve();
      }
    });


    (0, _promiseSerial2.default)([before, action, after]).then(function (result) {
      _logger2.default.info('run all action results', result);
    });
  })();
} catch (err) {
  _logger2.default.error(err);
}

function runScript(script, user, args, runOtps, done) {
  if (script) {
    var runner = (0, _suspawn.sudoSpawn)(script, user, args, runOtps);

    runner.stdout.on('data', function (data) {
      _logger2.default.info('stdout: ' + data);
    });

    runner.stderr.on('data', function (data) {
      _logger2.default.error('stderr: ' + data);
    });

    runner.on('close', function (code) {
      _logger2.default.info('child process exited with code ' + code);
      done();
    });
  } else {
    done('not script');
  }
}