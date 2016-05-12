import path from 'path';
import walk from 'fs-walk';
import fs from 'fs-extra';

export function copy(src, dest, options = {}) {
  const cpOpts = {
    clobber: true,
    dereference: true
  };

  const {uid, gid} = options;

  fs.copySync(src, dest, cpOpts);
  if (uid || gid) {
    walk.walkSync(dest, (basedir, filename) => {
      fs.chownSync(path.join(basedir, filename), uid, gid || uid);
    });
  }
  fs.chownSync(dest, uid, gid || uid);
}
