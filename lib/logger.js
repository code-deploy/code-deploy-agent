'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _jsLogger = require('js-logger');

var _jsLogger2 = _interopRequireDefault(_jsLogger);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_jsLogger2.default.useDefaults({
    logLevel: _jsLogger2.default[_config2.default.logLevel] || _jsLogger2.default.WARN,
    formatter: function formatter(messages, context) {
        messages.unshift('[DeployAgent]');
        if (context.name) messages.unshift('[' + context.name + ']');
    }
});

exports.default = _jsLogger2.default;