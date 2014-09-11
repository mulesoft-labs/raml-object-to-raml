var pick = require('lodash.pick');

/**
 * Transform a RAML object into a YAML compatible structure.
 *
 * @param  {Object} input
 * @return {Object}
 */
module.exports = function (input) {
  var output = pick(input, [
    'title',
    'version',
    'mediaType',
    'baseUri',
    'baseUriParameters',
    'documentation',
    'securitySchemes',
    'schemas'
  ]);

  return output;
};
