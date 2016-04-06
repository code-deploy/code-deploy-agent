'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TaskBase = undefined;

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaskBase = exports.TaskBase = function TaskBase() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, TaskBase);

  if (!options.id) {
    options.id = _nodeUuid2.default.v1();
  }

  this.id = options.id;
  this.name = options.name;
  // this.process =
};