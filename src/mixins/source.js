import assert from 'assert';

function getSourcesType(type) {
  var sources = require('../sources').default;

  return sources[type];
}

function getSources() {
  return require('../sources').default;
}

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

/*eslint no-unused-vars: ["error", {"args": "none"}]*/
function pickSourceType(type, opts = {})  {
  var source = getSourcesType(type);
  assert(source, 'Invalid source Type ' + source);

  return source;
}

function pickWithUrl(url) {
  var source;
  for (var type in getSources()) {
    source = getSourcesType(type);

    if (source.validFormat(url)) {
      break;
    }

    source = null;
  }

  assert(source, 'Invalid source url ' + url);
  return source;
}

export default function mixind(Composed) {
  return class extends Composed {
    constructor(opts) {
      super(opts);

      this.sourceUrl = opts.source;
      this.source = sourceType(this, opts);
    }
  };
}
