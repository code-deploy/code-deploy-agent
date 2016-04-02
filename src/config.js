import os from 'os';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


const cfgFiles = {
  default: path.resolve(__dirname, '../config/default.yml'),
  home: path.join(os.homedir(), '.deploy_agent'),
  etc: '/etc/deploy_agent'
};

const defaultConfig = readConfig(cfgFiles.default, 'utf8');
const homeConfig = readConfig(cfgFiles.home, 'uti8');
const etcCofnig = readConfig(cfgFiles.etc, 'uti8');

function readConfig(file) {
  try {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'));  
  } catch (err) {
    return {};
  }
}

export default {
  ...defaultConfig,
  ...homeConfig,
  ...etcCofnig
}
