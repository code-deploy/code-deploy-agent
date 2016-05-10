'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.type = exports.S3Source = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _class;
// import {runnify} from '../runner';


exports.create = create;
exports.validFormat = validFormat;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _awsSdk = require('aws-sdk');

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _url2 = require('url');

var _url3 = _interopRequireDefault(_url2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _tmp = require('tmp');

var _tmp2 = _interopRequireDefault(_tmp);

var _source = require('./source');

var _source2 = _interopRequireDefault(_source);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

var _mixins = require('../mixins');

var _preprocesses = require('../preprocesses');

var preprocesses = _interopRequireWildcard(_preprocesses);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var writeFileAsync = _bluebird2.default.promisify(_fs2.default.writeFile);
var tmpDirAsync = _bluebird2.default.promisify(_tmp2.default.dir);

_bluebird2.default.sequence = function (chain) {
  var results = [];
  var entries = chain;
  if (entries.entries) entries = entries.entries();
  return new _bluebird2.default(function (yes, no) {
    var next = function next() {
      var entry = entries.next();
      if (entry.done) yes(results);else {
        results.push(entry.value[1]().then(next, function () {
          no(results);
        }));
      }
    };
    next();
  });
};

var S3Source = exports.S3Source = (_dec = (0, _mixins.mixin)('task'), _dec2 = (0, _mixins.mixin)('marshal'), _dec(_class = _dec2(_class = function (_Source) {
  _inherits(S3Source, _Source);

  function S3Source(source, opts) {
    _classCallCheck(this, S3Source);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(S3Source).call(this, source, opts));

    var accessKeyId = _config2.default.accessKeyId;
    var secretAccessKey = _config2.default.secretAccessKey;
    var region = _config2.default.region;
    var apiVersion = _config2.default.apiVersion;

    var _url = _url3.default.parse(source);

    _this.bucket = _url.host;
    _this.key = _url.path.slice(1);

    _this.s3 = _bluebird2.default.promisifyAll(new _awsSdk2.default.S3({
      // endpoint,
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      region: region,
      apiVersion: apiVersion
    }));
    return _this;
  }

  _createClass(S3Source, [{
    key: 'read',
    value: function read() {
      var _this2 = this;

      this.mkdirp().then(function () {
        return _this2.fetchS3().timeout(_config2.default.downloads.maxTime);
      }).then(function () {
        return _this2.preprocessing().timeout(_config2.default.preprocesses.maxTime);
      }).then(function () {
        // this.taskTransitionTo('done');
      }).catch(_bluebird2.default.TimeoutError, function (err) {
        _this2.taskTransitionTo('timeout');
        _logger2.default.error(err, err.stack);
      }).catch(function (err) {
        _this2.taskClearTimeout();
        _this2.taskTransitionTo('error', err);
      });
    }
  }, {
    key: 'fetchS3',
    value: function fetchS3() {
      var _this3 = this;

      return new _bluebird2.default(function (res, rej) {
        tmpDirAsync().then(function (tmpDir) {
          _logger2.default.info('mkdir tmpdir ' + tmpDir);
          return _this3.s3.getObjectAsync({ Bucket: _this3.bucket, Key: _this3.key }).then(function (data) {
            var file = _path2.default.join(tmpDir, _this3.key);
            _this3.tempfile = file;
            _logger2.default.info('Write to file ' + file);
            var Body = data.Body;

            return writeFileAsync(file, Body);
          }).then(res).catch(function (err) {
            rej(err);
            _this3.taskClearTimeout();
            _this3.taskTransitionTo('error', err);
          });
        });
      });
    }
  }, {
    key: 'preprocessing',
    value: function preprocessing() {
      var preprocess = void 0;

      if (this.fileType) {
        preprocess = preprocesses[this.fileType];
      } else {
        preprocess = preprocesses.try(this.tempfile);
      }

      (0, _assert2.default)(preprocess, 'Invalid preprocess type in this file ' + this.tempfile);
      _logger2.default.info('Preprocess intermedia ' + this.tempfile + ' to ' + this.targetDir);
      return preprocess.extract(this.tempfile, this.targetDir, { overwrite: true });
    }
  }]);

  return S3Source;
}(_source2.default)) || _class) || _class);
var type = exports.type = 's3';

function create(source, opts) {
  return new S3Source(source, opts);
}

function validFormat(file) {
  return (/^s3:\/\//.test(file)
  );
}