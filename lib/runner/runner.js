'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

var _minimist = require('minimist');

var _minimist2 = _interopRequireDefault(_minimist);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var argv = (0, _minimist2.default)(process.argv.slice(2));
var deployFile = _path2.default.join(argv.dir, argv.file);

try {
  var deploy = _jsYaml2.default.safeLoad(_fsExtra2.default.readFileSync(deployFile, 'utf8'));

  (0, _assert2.default)(deploy.target, 'Deploy file must have spectify target');

  _fsExtra2.default.copySync(argv.dir, deploy.target);
  if (deploy.script) {
    (0, _child_process.spawn)(deploy.script, [], { cwd: deploy.target });
  }
} catch (err) {
  _logger2.default.error(err);
}