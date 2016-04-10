import * as zip from './zip';

export {
  zip
};

export function tryCodec(file) {
  const codecs = [zip];

  for (var codec in codecs) {
    if (codec.tryCodec(file)) {
      return codec;
    }
  }

  return null;
}
