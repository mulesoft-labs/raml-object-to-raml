var is = require('../utils/is');

/**
 * Sanitize a secured by array.
 *
 * @param  {Array} securedBy
 * @return {Array}
 */
module.exports = function (securedBy) {
  return securedBy.filter(function (value) {
    return is.null(value) || is.object(value) || is.string(value);
  });
}
