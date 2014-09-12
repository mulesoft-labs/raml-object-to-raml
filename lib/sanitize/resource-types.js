var methods       = require('methods');
var is            = require('../utils/is');
var sanitizeTrait = require('./trait');

/**
 * Escape characters used inside a method name for the regexp.
 *
 * @param  {String} str
 * @return {String}
 */
var escape = function (str) {
  return str.replace(/([\-])/g, '\\$1');
};

/**
 * Check if the key is potentially a method name.
 *
 * @type {RegExp}
 */
var METHOD_KEY_REGEXP = new RegExp(
  '(?:' + methods.map(escape).join('|') + ')\\??'
);

/**
 * Sanitize resource types suitable for RAML.
 *
 * @param  {Array} resourceTypes
 * @return {Array}
 */
module.exports = function (resourceTypes) {
  var array = [];

  resourceTypes.forEach(function (resourceTypeMap) {
    Object.keys(resourceTypeMap).forEach(function (type) {
      var obj          = {};
      var child        = obj[type] = {};
      var resourceType = resourceTypeMap[type];

      Object.keys(resourceType).forEach(function (key) {
        var value = resourceType[key];
        var keys  = ['type', 'usage', 'description'];

        if (METHOD_KEY_REGEXP.test(key)) {
          child[key] = value == null ? value : sanitizeTrait(value);
        }

        // Allow usage and description strings alongside methods.
        if (~keys.indexOf(key) && is.string(value)) {
          child[key] = value;
        }
      });

      array.push(obj);
    });
  });

  return array;
};
