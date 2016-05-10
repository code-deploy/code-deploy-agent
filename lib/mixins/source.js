'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mixind;

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function getSourcesType(type) {
  var sources = require('../sources').default;

  return sources[type];
}

function getSources() {
  return require('../sources').default;
}

function sourceType(task, opts) {
  var source;

  console.log(opts);
  if (opts.sourceType) {
    source = pickSourceType(opts.sourceType);
  } else {
    source = pickWithUrl(opts.source);
  }

  opts.task = task;

  return source.create(opts.source, opts);
}

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
function pickSourceType(type) {
  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var source = getSourcesType(type);
  (0, _assert2.default)(source, 'Invalid source Type ' + source);

  return source;
}

function pickWithUrl(url) {
  var source;
  for (var type in getSources()) {
    source = getSourcesType(type);

    if (source.validFormat(url)) {
      break;
    }

    source = null;
  }

  (0, _assert2.default)(source, 'Invalid source url ' + url);
  return source;
}

function mixind(Composed) {
  return function (_Composed) {
    _inherits(_class, _Composed);

    function _class(opts) {
      _classCallCheck(this, _class);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(_class).call(this, opts));

      _this.sourceUrl = opts.source;
      _this.source = sourceType(_this, opts);
      return _this;
    }

    return _class;
  }(Composed);
}