import argv from '../argv';

export function dot() {
  if (argv.process) {
    process.stdout.write('.');
  }
}
