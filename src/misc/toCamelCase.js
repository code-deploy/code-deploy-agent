/**
 * toCamelCase: converts string to camel case
 */

String.prototype.toCamelCase = function () {
  return this.replace(/^\s+|\s+$/g, "")
    .toLowerCase()
    .replace(/(\s[a-z0-9])/g, function ($1) {
      return $1.replace(/\s/, '').toUpperCase();
    })
    .replace(/\W/g, '');
};

export default String.prototype.toCamelCase;

