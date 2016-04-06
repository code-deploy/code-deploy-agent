'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toCamelCase = undefined;

var _timeHelper = require('./timeHelper');

Object.keys(_timeHelper).forEach(function (key) {
	if (key === "default") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _timeHelper[key];
		}
	});
});

var _decorate = require('./decorate');

Object.keys(_decorate).forEach(function (key) {
	if (key === "default") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _decorate[key];
		}
	});
});

var _toCamelCase = require('./toCamelCase');

var _toCamelCase2 = _interopRequireDefault(_toCamelCase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.toCamelCase = _toCamelCase2.default;