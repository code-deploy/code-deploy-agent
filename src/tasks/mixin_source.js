import sources from '../sources';
import assert from 'assert';

const SourceTypes = Object.keys(sources);

function sourceType (task, opts) {
  var source;

  if (opts.sourceType) {
    source = pickSourceType(opts.sourceType);
  } else {
    source = pickWithUrl(opts.source);
  }

  opts.task = task;

  return source.create(opts.source, opts);
}

// export function parseSource(sourceUrl, opts) {
//   var source;
//   for (var type in sources) {
//     var source = sources[type];

//     if (source.validFormat(sourceUrl)) {
//       break;
//     }

//     source = null;
//   }

//   assert(source, 'Invalid source url ' + sourceUrl);

//   return source.create(sourceUrl, opts)
// }

// export function createSource(type, sourceUrl, opts) {
//   assert(sources[type], 'Invalid source Type ' + sources[type]);

//   var source = sources[type];
//   return source.create(sourceUrl, opts)
// }

function pickSourceType(type, opts)  {
  assert(sources[type], 'Invalid source Type ' + sources[type]);

  return sources[type];
}

function pickWithUrl(url) {
  var source;
  for (var type in sources) {
    var source = sources[type];

    if (source.validFormat(url)) {
      break;
    }

    source = null;
  }

  assert(source, 'Invalid source url ' + url);
  return source;
}

// var source = pickSourceType(opts)

export function mixSource(Composed) {
  return class extends Composed {
    constructor(opts) {
      super(opts);

      // Composed.prototype.constructor.call(this, opts);

      this.sourceUrl = opts.source;
      this.source = sourceType(this, opts);
    }
  }
}
