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
}

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
    var child = obj[key] = {};

    // Avoid unneccessary display names.
    if (is.string(param.displayName) && key !== param.displayName) {
      child.displayName = param.displayName;
    }

    if (is.string(param.type) && TYPES.hasOwnProperty(param.type)) {
      child.type = param.type;
    }

    if (is.string(param.description)) {
      child.description = param.description;
    }

    if (is.array(param.enum)) {
      child.enum = param.enum;
    }

    if (is.string(param.pattern)) {
      child.pattern = param.pattern;
    }

    if (is.number(param.minLength)) {
      child.minLength = param.minLength;
    }

    if (is.number(param.maxLength)) {
      child.maxLength = param.maxLength;
    }

    if (is.number(param.minimum)) {
      child.minimum = param.minimum;
    }

    if (is.number(param.maximum)) {
      child.maximum = param.maximum;
    }

    if (param.example != null && is.primitive(param.example)) {
      child.example = param.example;
    }

    if (param.default != null && is.primitive(param.default)) {
      child.default = param.default;
    }

    if (is.boolean(param.repeat)) {
      child.repeat = param.repeat;
    }

    if (is.boolean(param.required)) {
      child.required = param.required;
    }
  });

  return obj;
};
