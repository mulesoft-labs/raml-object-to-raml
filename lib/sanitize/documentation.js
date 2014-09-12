var is = require('../utils/is');

/**
 * Sanitize documentation for RAML.
 *
 * @param  {Array} documentation
 * @return {Array}
 */
module.exports = function (documentation) {
  return documentation.filter(function (document) {
    return is.string(document.title) && is.string(document.content);
  }).map(function (document) {
    return {
      title:   document.title,
      content: document.content
    };
  });
};
