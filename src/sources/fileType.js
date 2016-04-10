const FileTypes = {
  zip: '.zip',
  targz: '.tar.gz',
  tarbz2: '.tar.bz2'
};

export function check(url) {

  for (var type in FileTypes) {
    var extName = FileTypes[type];

    if (~url.lastIndexOf(extName)) {
      return type;
    }
  }

  return null;
}

