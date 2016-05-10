import parseArgs from 'minimist';
require('./misc/toCamelCase');

var _argv = parseArgs(process.argv.slice(2));
var argv = {};

for (var key in _argv) {
  argv[key.toCamelCase()] = _argv[key];
}

export default argv;
