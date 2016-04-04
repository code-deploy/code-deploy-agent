'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
// import Promise from 'bluebird';

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _taskManager = require('./taskManager');

var taskManager = _interopRequireWildcard(_taskManager);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _misc = require('./misc');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var agentInstance;

function isProcessRunning(pid) {
  try {
    return process.kill(pid + 0, 0) !== 0;
  } catch (err) {
    return false;
  }
}

var Agent = function () {
  function Agent() {
    _classCallCheck(this, Agent);
  }

  _createClass(Agent, [{
    key: 'checkLoaded',


    // check /tmp/deploy-agent.pid
    value: function checkLoaded() {
      var pidfile = _path2.default.join(_config2.default.workDir, _config2.default.pidfile);

      try {
        _fs2.default.accessSync(_path2.default.dirname(pidfile), _fs2.default.F_OK);
      } catch (err) {
        if (err.code === 'ENOENT') {
          _mkdirp2.default.sync(_path2.default.dirname(pidfile));
          _fs2.default.writeFileSync(pidfile, process.pid.toString());
        } else {
          _logger2.default.error(err.message);
          process.exit(-1);
        }
      }

      var pid = parseInt(_fs2.default.readFileSync(pidfile));

      if (isProcessRunning(pid)) {
        _logger2.default.error('Always running the deploy-agent instance. checking ', pidfile);
        process.exit(-1);
      } else {
        _fs2.default.writeFileSync(pidfile, process.pid.toString());
      }
    }

    // Ctrl + c break;

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
      this.checkLoaded();
      this.trap('SIGINT', function () {
        return process.exit();
      });

      taskManager.run();
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