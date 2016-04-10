import AdmZip from 'adm-zip';
import buckle from 'buckle';
import Utils from 'adm-zip/util';
import {promisify} from 'bluebird';

function buckleExtract(zip, to, opts = {}, cb) {
  buckle.open(zip, to, cb);
}

export var extract = promisify(buckleExtract);

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
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
    zip.zip;
  } catch (err) {
    if (err == Utils.Errors.INVALID_FILENAME) {
      return false;
    } else {
      throw err;
    }
  }

  return true;
}
