var extend = require('xtend/mutable');
var is     = require('../utils/is');

/**
 * Map of valid types.
 *
 * @type {Object}
 */
var TYPES = {
  string:  true,
  number:  true,
  integer: true,
  date:    true,
  boolean: true,
  file:    true
};

/**
 * Sanitize a single parameter representation.
 *
 * @param  {Object} param
 * @param  {String} key
 * @return {Object}
 */
var sanitizeParameter = function (param, key) {
  var obj = {};

  // Avoid unneccessary display names.
  if (is.string(param.displayName) && key !== param.displayName) {
    obj.displayName = param.displayName;
  }

  if (is.string(param.type) && TYPES.hasOwnProperty(param.type)) {
    obj.type = param.type;
  }

  if (is.string(param.description)) {
    obj.description = param.description;
  }

  if (is.array(param.enum)) {
    obj.enum = param.enum;
  }

  if (is.string(param.pattern)) {
    obj.pattern = param.pattern;
  }

  if (is.number(param.minLength)) {
    obj.minLength = param.minLength;
  }

  if (is.number(param.maxLength)) {
    obj.maxLength = param.maxLength;
  }

  if (is.number(param.minimum)) {
    obj.minimum = param.minimum;
  }

  if (is.number(param.maximum)) {
    obj.maximum = param.maximum;
  }

  if (param.example != null && is.primitive(param.example)) {
    obj.example = param.example;
  }

  if (param.default != null && is.primitive(param.default)) {
    obj.default = param.default;
  }

  if (is.boolean(param.repeat)) {
    obj.repeat = param.repeat;
  }

  if (is.boolean(param.required)) {
    obj.required = param.required;
  }

  return obj;
};

/**
 * Sanitize parameters and ensure the object structure is correct.
 *
 * @param  {Object} params
 * @return {Object}
 */
module.exports = function (params) {
  var obj = {};

  Object.keys(params).forEach(function (key) {
    var param = params[key];

    if (is.array(param)) {
      return obj[key] = param.map(sanitizeParameter);
    }

    obj[key] = sanitizeParameter(param, key);
  });

  return obj;
};
