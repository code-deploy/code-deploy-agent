import sources from '../sources';
import assert from 'assert';
import { Task } from '../task';

const SourceTypes = Object.keys(sources);

function sourceType (opts) {
  if (opts.sourceType) {
    return createSource(opts.source, opts.sourceType, opts);
  } else {
    return parseSource(opts.source);
  }
}

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


export function mixSource(Composed) {
  return class extends Composed {
    constructor(opts) {
      super(opts);

      // Composed.prototype.constructor.call(this, opts);

      this.sourceUrl = opts.source;
      this.source = sourceType(opts);
    }
  }
}
