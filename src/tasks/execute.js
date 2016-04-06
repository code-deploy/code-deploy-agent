import cp from 'child_process';
import path from 'path';
import log from '../logger';

// // execute 可以启动一个子进程运行指定的 pure code , Pure code 不能引用外部对像
// // 只是运行在远程的代码，只能访问我们注入的环境等。
// export function execute(pureHandler, context = {}) {

// }
//
const DEFAULT_SCRIPT = 'deploy.yml';

function configAction(actionOpts) {
  const { action } = actionOpts;

  switch(action) {
    case 'inline':
      return {
        type: 'inline',
        script: actionOpts.script
      }
    default:
      return {
        type: 'file',
        filename: actionOpts.file || DEFAULT_SCRIPT
      }
  }
}

function defaultAction() {
  return {
    type: 'file',
    filename: DEFAULT_SCRIPT
  }
}

export default function mixind(Composed) {

  return class extends Composed {
    action = defaultAction();

    constructor(opts) {
      super(opts);

      if (opts.action) {
        this.action = configAction(opts);
      }
    }

    execute () {
      return new Promise((resolve, reject) => {
        if (this.action.inline) {
          this.executeInlineScript(this.action.script, resolve)
        } else {
          this.executeScript(this.action.filename, resolve)
        }
      });
    }

    excuteInlineScript (script, cb) {

    }

    executeScript (file, cb) {
      log.info(`Execute Task  ${this.id} script ${file}`);
      var args = [
        '--task', this.id,
        '--dir', this.source.targetDir,
        '--file', file
      ];

      var script = cp.fork(path.resolve(__dirname, '../runner/runner.js'), args)
      script.on('exit', (code) => {
        log.info(`Task Script done`);
        cb(code);
      });
    }
  }
}
