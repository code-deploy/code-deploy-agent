'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _misc = require('misc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var agentInstance;

function processRunning(pid) {
  try {
    process.kill(pid + 0, 0);
    return true;
  } catch (err) {
    return false;
  }
}

var TaskStatus = ['running', 'done', 'ready', 'failed', 'timeout'];

function checkTaskState(task) {
  for (var i = 0; i < TaskStatus.length; i++) {
    var state = TaskStatus[i];
    var methodName = 'is' + state.toCamelCase();
    var stateMethod = task[methodName];

    if (util.isFunction(stateMethod)) {
      if (stateMethod.call(task)) {
        return methodName;
      }
    }
  }

  return 'unknown';
}

var Agent = function () {
  function Agent() {
    _classCallCheck(this, Agent);

    this.tasks = new Queue();
  }

  _createClass(Agent, [{
    key: 'checkLoaded',
    value: function checkLoaded() {
      var pidfile = _path2.default.join('/tmp/deploy-agent/', 'deploy-agent.pid');

      try {
        _fs2.default.accessSync(_path2.default.dirname(pidfile), _fs2.default.F_OK);
      } catch (err) {
        if (err.code === 'ENOENT') {
          _mkdirp2.default.sync(_path2.default.dirname(pidfile));
          _fs2.default.writeFileSync(pidfile, process.pid.toString());
        } else {
          console.error(err);
          process.exit(-1);
        }
      }

      var pid = parseInt(_fs2.default.readFileSync(pidfile));

      if (processRunning(pid)) {
        console.error('Always running the deploy-agent instance. checking ', pidfile);
        process.exit(-1);
      } else {
        _fs2.default.writeFileSync(pidfile, process.pid.toString());
      }
    }
  }, {
    key: 'trap',
    value: function trap(signal, cb) {
      process.on(signal, function () {
        console.log("Caught interrupt signal");
        cb();
      });
    }
  }, {
    key: 'mainLoop',
    value: function mainLoop() {
      var _this = this;

      this.checkLoaded();
      this.trap('SIGINT', function () {
        return process.exit();
      });

      var timer = setInterval(function () {
        return _this._main();
      }, 100);
      timer.ref();
    }
  }, {
    key: '_main',
    value: function _main() {
      try {
        var task = this.tasks.next();

        if (task) {
          switch (checkTaskState(task)) {
            case 'ready':
              console.log('ready');
              break;
            case 'running':
              console.log('running');
              break;
            case 'done':
              console.log('done');
              break;
            case 'failed':
              console.log('failed');
              break;
            case 'timeout':
              console.log('timeout');
              break;
            default:
              console.log('unknown');
          }
        } else {
          console.log('.');
        }
      } catch (err) {
        console.error(err);
        return;
      }
    }
  }], [{
    key: 'run',
    value: function run() {
      agentInstance = new Agent();
      agentInstance.mainLoop();
    }
  }]);

  return Agent;
}();

Agent.run();