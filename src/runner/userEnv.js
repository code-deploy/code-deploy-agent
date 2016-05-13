import {spawnSync} from 'child_process';

export function userEnv(user) {
  const {output} =  spawnSync('sudo', ['-iHu', user, 'env']);
  const lines = output.toString().split('\n');
  let results = {}
  lines.forEach(line => {
    const pos = line.indexOf('=');
    if (pos > 0) {
      const name = line.slice(0, pos);
      const value = line.slice(pos+1);
      results[name] = value;
    }
  });

  return results;
}
