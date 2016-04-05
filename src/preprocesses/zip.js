import AdmZip from 'adm-zip';
import Utils from 'adm-zip/util';
import { promisify } from 'bluebird';

var extract = promisify(function extractSync(from, to, opts = {overwrite: true}, cb) {
  console.log(from);

  var zip = new AdmZip(from);
  var { overwrite } = opts

  zip.extractAllToAsync(to, overwrite, cb);
});

export var extract = extract;

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
