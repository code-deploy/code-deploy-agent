'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copy = copy;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fsWalk = require('fs-walk');

var _fsWalk2 = _interopRequireDefault(_fsWalk);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function copy(src, dest) {
  var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var cpOpts = {
    clobber: true,
    dereference: true
  };

  var uid = options.uid;
  var gid = options.gid;


  _fsExtra2.default.copySync(src, dest, cpOpts);
  if (uid || gid) {
    _fsWalk2.default.walkSync(dest, function (basedir, filename) {
      _fsExtra2.default.chownSync(_path2.default.join(basedir, filename), uid, gid || uid);
    });
  }
  _fsExtra2.default.chownSync(dest, uid, gid || uid);
}