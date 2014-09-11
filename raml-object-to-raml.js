var sanitize  = require('./lib/sanitize');
var stringify = require('./lib/stringify');

/**
 * Transform a RAML object into a RAML string.
 *
 * @param  {Object} obj
 * @return {String}
 */
module.exports = function (obj) {
  return '#%RAML 0.8\n' + stringify(sanitize(obj));
};
