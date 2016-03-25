var extend             = require('xtend/mutable');
var is                 = require('../utils/is');
var sanitizeTrait      = require('./trait');
var sanitizeParameters = require('./parameters');

/**
 * Sanitize a method into RAML structure for stringification.
 *
 * @param  {Object} method
 * @return {Object}
 */
var sanitizeMethods = function (methods) {
  var obj = {};

  methods.forEach(function (method) {
    var child = obj[method.method.toLowerCase()] = {};

    if (is.array(method.is)) {
      child.is = method.is;
    }

    extend(child, sanitizeTrait(method));
  });

  return obj;
};

/**
 * Sanitize the resources array to the correct RAML structure.
 *
 * @param  {Array}  resources
 * @return {Object}
 */
module.exports = function sanitizeResources (resources) {
  var obj = {};

  resources.forEach(function (resource) {
    var child = obj;

    if (resource.relativeUri) {
      child = obj[resource.relativeUri] = obj[resource.relativeUri] || {};
    }

    if (resource.uriParameters) {
      child.uriParameters = sanitizeParameters(resource.uriParameters);
    }

    if (is.string(resource.type) || is.object(resource.type)) {
      child.type = resource.type;
    }

    if (is.array(resource.is)) {
      child.is = resource.is;
    }

    if (is.string(resource.description)) {
      child.description = resource.description;
    }

    if (is.array(resource.methods)) {
      extend(child, sanitizeMethods(resource.methods));
    }

    if (is.array(resource.resources)) {
      extend(child, sanitizeResources(resource.resources));
    }
  });

  return obj;
};
