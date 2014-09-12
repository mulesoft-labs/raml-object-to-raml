var extend                  = require('xtend/mutable');
var is                      = require('../utils/is');
var sanitizeSchemas         = require('./schemas');
var sanitizeParameters      = require('./parameters');
var sanitizeDocumentation   = require('./documentation');
var sanitizeSecuritySchemes = require('./security-schemes');
var sanitizeResources       = require('./resources');
var sanitizeResourceTypes   = require('./resource-types');
var sanitizeTraits          = require('./traits');

/**
 * Transform a RAML object into a YAML compatible structure.
 *
 * @param  {Object} input
 * @return {Object}
 */
module.exports = function (input) {
  var output = {};

  if (is.string(input.title)) {
    output.title = input.title;
  }

  if (is.string(input.version) || is.number(input.version)) {
    output.version = input.version;
  }

  if (is.string(input.mediaType)) {
    output.mediaType = input.mediaType;
  }

  if (is.string(input.baseUri)) {
    output.baseUri = input.baseUri;
  }

  if (is.object(input.baseUriParameters)) {
    output.baseUriParameters = sanitizeParameters(input.baseUriParameters);
  }

  if (is.array(input.documentation)) {
    output.documentation = sanitizeDocumentation(input.documentation);
  }

  if (is.array(input.securitySchemes)) {
    output.securitySchemes = sanitizeSecuritySchemes(input.securitySchemes);
  }

  if (is.array(input.schemas)) {
    output.schemas = sanitizeSchemas(input.schemas);
  }

  if (is.array(input.resourceTypes)) {
    output.resourceTypes = sanitizeResourceTypes(input.resourceTypes);
  }

  if (is.array(input.traits)) {
    output.traits = sanitizeTraits(input.traits);
  }

  if (is.array(input.resources)) {
    extend(output, sanitizeResources(input.resources));
  }

  return output;
};
