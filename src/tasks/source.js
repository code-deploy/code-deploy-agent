import sources from '../sources';
import assert from 'assert';

const SourceTypes = Object.keys(sources);

export function parseSource(sourceUrl) {
  var source;
  for (var type in sources) {
    var source = sources[type];

    if (source.validFormat(sourceUrl)) {
      break;
    }

    source = null;
  }

  assert(source, 'Invalid source url ' + sourceUrl);

  return source.create(source.type, sourceUrl)
}

export function createSource(type, sourceUrl, opts) {
  assert(sources[type], 'Invalid source Type ' + sources[type]);

  var source = sources[type];
  return source.create(sourceUrl, opts)
}
