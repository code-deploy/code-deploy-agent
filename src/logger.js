// import Logger from 'js-logger';
import winston from 'winston';
import argv from './argv';
// import fs from 'fs';
import config from './config';

const transports = (argv.d || argv.daemon) ? [new (winston.transports.Console)(),
    new (winston.transports.File)({filename: config.logfile})] : [new (winston.transports.Console)()];

var logger = new winston.Logger({
  level: 'info',
  transports
});

export default logger;
