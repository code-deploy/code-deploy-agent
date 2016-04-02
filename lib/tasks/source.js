'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSource = parseSource;
exports.createSource = createSource;

var _sources = require('../sources');

var _sources2 = _interopRequireDefault(_sources);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SourceTypes = Object.keys(_sources2.default);

function parseSource(sourceUrl) {
  var source;
  for (var type in _sources2.default) {
    var source = _sources2.default[type];

    if (source.validFormat(sourceUrl)) {
      break;
    }

    source = null;
  }

  (0, _assert2.default)(source, 'Invalid source url ' + sourceUrl);

  return source.create(source.type, sourceUrl);
}

function createSource(type, sourceUrl, opts) {
  (0, _assert2.default)(_sources2.default[type], 'Invalid source Type ' + _sources2.default[type]);

  var source = _sources2.default[type];
  return source.create(sourceUrl, opts);
}