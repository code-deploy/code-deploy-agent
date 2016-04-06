'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.runnify = runnify;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _misc = require('../misc');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DEFAULT_MSG = 'This function running in child process...';

function handleDescriptor(target, key, descriptor, _ref) {
  var _ref2 = _slicedToArray(_ref, 1);

  var filename = _ref2[0];

  if (typeof descriptor.value !== 'function') {
    throw new SyntaxError('Only functions can be runnify');
  }

  var methodSignature = target.constructor.name + '#' + key;

  (0, _assert2.default)(filename, 'Must specify runner filename in arguments');

  return _extends({}, descriptor, {
    value: function runnifyWrapper() {
      // var data = JSON.stringify(this);
      console.log(this);

      return new Promise(function (resolve, reject) {
        var child = (0, _child_process.fork)(_path2.default.join(__dirname, 'runner.js'), [filename, methodSignature], { timeout: 20 });

        child.on('exit', function (code) {
          resolve(code);
        });

        child.on('close', function (code) {
          resolve(code);
        });
      });
    }
  });
}

function runnify() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _misc.decorate)(handleDescriptor, args);
}