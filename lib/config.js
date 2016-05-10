'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _jsYaml = require('js-yaml');

var _jsYaml2 = _interopRequireDefault(_jsYaml);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cfgFiles = {
  default: _path2.default.resolve(__dirname, '../config/default.yml'),
  home: _path2.default.join(_os2.default.homedir(), '.deploy_agent'),
  etc: '/etc/deploy_agent'
};

var defaultConfig = readConfig(cfgFiles.default, 'utf8');
var homeConfig = readConfig(cfgFiles.home, 'uti8');
var etcConfig = readConfig(cfgFiles.etc, 'uti8');

function readConfig(file) {
  try {
    return _jsYaml2.default.safeLoad(_fs2.default.readFileSync(file, 'utf8'));
  } catch (err) {
    return {};
  }
}

/*jshint ignore:start*/
exports.default = Object.assign(defaultConfig, homeConfig, etcConfig);
/*jshint ignore:end*/