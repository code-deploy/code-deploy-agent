'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.check = check;
var FileTypes = {
  zip: '.zip',
  targz: '.tar.gz',
  tarbz2: '.tar.bz2'
};

function check(url) {

  for (var type in FileTypes) {
    var extName = FileTypes[type];

    if (!!url.lastIndexOf(extName)) {
      return type;
    }
  }

  return null;
}