'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = mixind;

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// // execute 可以启动一个子进程运行指定的 pure code , Pure code 不能引用外部对像
// // 只是运行在远程的代码，只能访问我们注入的环境等。
// export function execute(pureHandler, context = {}) {

// }
//
var DEFAULT_SCRIPT = 'deploy.yml';

function configAction(actionOpts) {
  var action = actionOpts.action;


  switch (action) {
    case 'inline':
      return {
        type: 'inline',
        script: actionOpts.script
      };
    default:
      return {
        type: 'file',
        filename: actionOpts.file || DEFAULT_SCRIPT
      };
  }
}

function defaultAction() {
  return {
    type: 'file',
    filename: DEFAULT_SCRIPT
  };
}

function mixind(Composed) {

  return function (_Composed) {
    _inherits(_class2, _Composed);

    function _class2(opts) {
      _classCallCheck(this, _class2);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class2).call(this, opts));

      _this.action = defaultAction();


      if (opts.action) {
        _this.action = configAction(opts);
      }
      return _this;
    }

    _createClass(_class2, [{
      key: 'execute',
      value: function execute() {
        var _this2 = this;

        return new Promise(function (resolve) {
          if (_this2.action.inline) {
            _this2.executeInlineScript(_this2.action.script, resolve);
          } else {
            _this2.executeScript(_this2.action.filename, resolve);
          }
        });
      }

      /*eslint no-unused-vars: ["error", {"args": "none"}]*/

    }, {
      key: 'excuteInlineScript',
      value: function excuteInlineScript(script, cb) {}
    }, {
      key: 'executeScript',
      value: function executeScript(file, cb) {
        _logger2.default.info('Execute Task  ' + this.id + ' script ' + file);
        var args = ['--task', this.id, '--dir', this.source.targetDir, '--file', file];

        var script = _child_process2.default.fork(_path2.default.resolve(__dirname, '../runner/runner.js'), args);
        script.on('exit', function (code) {
          _logger2.default.info('Task Script done');
          cb(code);
        });
      }
    }]);

    return _class2;
  }(Composed);
}