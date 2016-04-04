'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSource = parseSource;
exports.createSource = createSource;
exports.mixSource = mixSource;

var _sources = require('../sources');

var _sources2 = _interopRequireDefault(_sources);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SourceTypes = Object.keys(_sources2.default);

function sourceType(opts) {
  if (opts.sourceType) {
    return createSource(opts.source, opts.sourceType, opts);
  } else {
    return parseSource(opts.source);
  }
}

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

function mixSource(Composed) {
  return function (_Composed) {
    _inherits(_class, _Composed);

    function _class(opts) {
      _classCallCheck(this, _class);

      // Composed.prototype.constructor.call(this, opts);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, opts));

      _this.sourceUrl = opts.source;
      _this.source = sourceType(opts);
      return _this;
    }

    return _class;
  }(Composed);
}