var extend             = require('xtend/mutable');
var is                 = require('../utils/is');
var sanitizeParameters = require('./parameters');

/**
 * Sanitize the responses object.
 *
 * @param  {Object} responses
 * @return {Object}
 */
var sanitizeResponses = function (responses) {
  return responses;
};

/**
 * Sanitize a method into RAML structure for stringification.
 *
 * @param  {Object} method
 * @return {Object}
 */
var sanitizeMethods = function (methods) {
  var obj = {};

  methods.forEach(function (method) {
    var child = obj[method.method] = {};

    if (is.array(method.is)) {
      child.is = method.is;
    }

    if (is.object(method.headers)) {
      child.headers = sanitizeParameters(method.headers);
    }

    if (is.object(method.queryParameters)) {
      child.queryParameters = sanitizeParameters(method.queryParameters);
    }

    if (is.object(method.responses)) {
      child.responses = sanitizeResponses(method.responses);
    }
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
    if (!resource.relativeUri) {
      return;
    }

    var child = obj[resource.relativeUri] = {};

    if (is.string(resource.type)) {
      child.type = resource.type;
    }

    if (is.array(resource.resources)) {
      extend(child, sanitizeResources(resource.resources));
    }

    if (is.array(resource.methods)) {
      extend(child, sanitizeMethods(resource.methods));
    }
  });

  return obj;
};
