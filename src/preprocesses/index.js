import * as zip from './zip';
import * as targz from './tar.gz';

export {
  zip,
  targz
};

export function tryCodec(file) {
  const codecs = [zip, targz];

  for (var codec in codecs) {
    if (codec.tryCodec(file)) {
      return codec;
    }
  }

  return null;
}
