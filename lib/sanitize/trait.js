var is                 = require('../utils/is');
var sanitizeResponses  = require('./responses');
var sanitizeParameters = require('./parameters');
var sanitizeSecuredBy  = require('./secured-by');

/**
 * Sanitize a trait-like object.
 *
 * @param  {Object} trait
 * @return {Object}
 */
module.exports = function (trait) {
  var obj = {};

  if (is.string(trait.usage)) {
    obj.usage = trait.usage;
  }

  if (is.string(trait.description)) {
    obj.description = trait.description;
  }

  if (is.object(trait.headers)) {
    obj.headers = sanitizeParameters(trait.headers);
  }

  if (is.object(trait.queryParameters)) {
    obj.queryParameters = sanitizeParameters(trait.queryParameters);
  }

  if (is.object(trait.body)) {
    obj.body = trait.body;
  }

  if (is.object(trait.responses)) {
    obj.responses = sanitizeResponses(trait.responses);
  }

  if (is.array(trait.securedBy)) {
    obj.securedBy = sanitizeSecuredBy(trait.securedBy)
  }

  return obj;
};
