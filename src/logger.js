import Logger from 'js-logger';
import config from './config';

Logger.useDefaults({
  logLevel: Logger[config.logLevel] || Logger.WARN,
  formatter: function (messages, context) {
    messages.unshift('[DeployAgent]');
    if (context.name) messages.unshift('[' + context.name + ']');
  }
})

export default Logger
