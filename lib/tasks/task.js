'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Task = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

exports.createTask = createTask;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _base = require('./base');

var _misc = require('../misc');

var _mixins = require('../mixins');

var _execute = require('./execute');

var _execute2 = _interopRequireDefault(_execute);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// 执行模块


/**
 * Task 任务基础元数据
 * 1. name: 任务名称, 做为独立的任务划分区分，通常会导致同类的任务堆叠且顺序的执行。
 * 2. source: 资源来源
 *   a. sourceType: （可选）资源类型，包括，（local) 本地文件系统， (http)
 *       互联网资源系统 （ftp) 文件传输协议 (s3) 亚马逊存储服务地址等。
 *   b. source: 资源实际地址，根据不同的类型 sourceType
 *       会区分不同的，获取资源的方式，比如（local Agent
 *      会访问地址文件地址 , s3 会启用 AWS s3 下载方式进行下载)。
 *   c. fileType: （可选）文件类型会指明 source
 *       资源的下载后的文件类型是什么，一般会自动根据资源类型的后缀进行判断
 *       但是指定时会，会使文件在打开前，进行文件打开的预处理（类型支持为
 *       zip , tar.gz, tar.bz2) 通常是解压
 *
 * 3. action: 动作类型，告诉 Agent 对于下载的资源进行什么样的操作，通常是 Uncompress,
 *       Nothing, Parse (默认动作)
 *    a. deployFile: 动作文件指定，默认是(资源根目录下面的 deploy.yml)
 *    b. inline: 内置脚本执行不需要 deployFile 的存在
 *
 * 4. 执行期的参数
 *   createAt:　任务生成的时间，通常是收到任务触发信号的时间
 *   updateAt:　任务发生变更状态的时间，最后一次状态变更的时间
 *   startAt: 任务真实开始执行的时间
 *   endAt:　任务失败或完成的时间
 *
 *   stepTimeout: 每个任务步骤最长无响应时间，单位为秒， 默认 120s
 *
 */
var Task = exports.Task = (_dec = (0, _mixins.mixin)('meta'), _dec2 = (0, _mixins.mixin)('source'), _dec3 = (0, _mixins.mixin)('status'), _dec4 = (0, _mixins.mixin)('timeout'), _dec5 = (0, _mixins.mixin)(_execute2.default), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = function (_TaskBase) {
  _inherits(Task, _TaskBase);

  function Task() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Task);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Task)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.status = {
      "ready": ['running', 'done'],
      "stop": ['running', 'done'],
      "running": ['stop', 'done', 'error', 'timeout'],
      "error": ['running', 'done', 'timeout'],
      "timeout": ['running', 'done']
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Task, [{
    key: 'start',


    /**
     * start 启动任务 Task 将转进 running 状态，并初始化各项数据 ，任务管理
     * 器会监视任务的状态，是否有执行超时间等。
     */
    value: function start() {
      var _this2 = this;

      (0, _assert2.default)(this.source, 'Invalid source, this ' + this.id + 'cant have source');

      Promise.resolve(this.source.read()).then(function (targetDir) {
        return _this2.execute(); // 执行部署脚本
      }).then(function (result) {
        _this2.transitionTo('done');
      }).catch(Promise.TimeoutError, function () {
        _this2.transitionTo('timeout');
      }).catch(function (err) {
        _this2.transitionTo('error', err);
      });

      this.transitionTo('running');
    }

    /**
     * stop 停止任务，会保存任务的数据，把任务转入停止状态。
     */

  }, {
    key: 'stop',
    value: function stop() {
      this.transitionTo('stop');
    }

    /**
     * kill 杀死任务，会将任务完全移出 任务列队(quque) 不再占用内存等
     * Agent 也不再监控它的状态，即彻底的死亡
     */

  }, {
    key: 'kill',
    value: function kill() {
      this._clearTimeout();
    }

    /** enterRunning 进入运行状态的事件*/

  }, {
    key: 'enterRunning',
    value: function enterRunning() {
      var _this3 = this;

      this.delay((0, _misc.s)(20), function () {
        return _this3.transitionTo('timeout');
      });
    }

    /** enterTimeout 超时会自动杀死任务*/

  }, {
    key: 'enterTimeout',
    value: function enterTimeout() {
      this.kill();
    }
  }, {
    key: 'enterError',
    value: function enterError(err) {
      _logger2.default.error(err.stack);
    }
  }]);

  return Task;
}(_base.TaskBase)) || _class) || _class) || _class) || _class) || _class);
function createTask(opts, from) {
  return new Task(opts);
}