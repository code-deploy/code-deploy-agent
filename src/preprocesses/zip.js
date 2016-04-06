import fs from 'fs';
import AdmZip from 'adm-zip';
import buckle from 'buckle';
import unzip from 'unzip';
import Utils from 'adm-zip/util';
import { promisify } from 'bluebird';
import log from '../logger';



var extract = promisify(function extractSync(from, to, opts = {overwrite: true}, cb) {
  log.info(`Zip starting extract all files to ${to}...`);

  var zip = new AdmZip(from);
  var { overwrite } = opts

  zip.extractAllToAsync(to, overwrite, (...args) => {
    log.info(`Zip extract all files done`);
    cb(...args);
  });
});

function extractZip(zip, to, opts = {}, cb ) {
  fs.createReadStream(zip)
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      var fileName = entry.path;
      var type = entry.type; // 'Directory' or 'File'
      var size = entry.size;
      console.log(entry);
      if (fileName === "this IS the file I'm looking for") {
        entry.pipe(fs.createWriteStream(to));
      } else {
        entry.autodrain();
      }
    });
}

function buckleExtract(zip, to, opts = {}, cb) {
  buckle.open(zip, to, cb)
}

export var extract = promisify(buckleExtract);

export function extractStream(from , to) {

}

/**
 * try 尝试验证 zip 文件方法，必须实现
 * @param  {string} file 输入文件路径名
 * @return {boolean}      正确格式返回 true
 */
export function tryCodec(file) {
  try {
    var zip = new AdmZip(file);
  } catch (err) {
    if (err == Utils.Errors.INVALID_FILENAME) {
      return false
    } else {
      throw err;
    }
  }

  return true;
}
