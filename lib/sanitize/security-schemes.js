var is            = require('../utils/is');
var sanitizeTrait = require('./trait');

/**
 * Map of valid authentication types.
 *
 * @type {Object}
 */
var AUTH_TYPES = {
  'Basic Authentication':  true,
  'Digest Authentication': true,
  'OAuth 1.0':             true,
  'OAuth 2.0':             true
};

/**
 * Sanitize security schemes.
 *
 * @param  {Array} securitySchemes
 * @return {Array}
 */
module.exports = function (securitySchemes) {
  var array = [];

  securitySchemes.forEach(function (schemeMap) {
    Object.keys(schemeMap).forEach(function (key) {
      var scheme = schemeMap[key];

      if (!AUTH_TYPES[scheme.type] && !/^x-/i.test(scheme.type)) {
        return;
      }

      var obj  = {};
      var data = obj[key] = { type: scheme.type };

      if (is.string(scheme.description)) {
        data.description = scheme.description;
      }

      if (is.object(scheme.describedBy)) {
        data.describedBy = sanitizeTrait(scheme.describedBy);
      }

      if (is.object(scheme.settings)) {
        data.settings = scheme.settings;
      }

      array.push(obj);
    });
  });

  return array;
};
