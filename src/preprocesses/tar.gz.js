// import targz from 'tar.gz';
import tarball from 'tarball-extract';
import log from '../logger';
import {promisify} from 'bluebird';

function tarballExtract(tar, to, opts = {}, cb) {
  log.info('tar.gz extract...');
  tarball.extractTarball(tar, to, cb);
}

export var extract = promisify(tarballExtract);

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
export function extractStream(from , to) {

}

/**
 * try 尝试验证 targz 文件方法，必须实现
 * @param  {string} file 输入文件路径名
 * @return {boolean}      正确格式返回 true
 */
export function tryCodec(file) {
  return false;
}
