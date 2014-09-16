var extend   = require('xtend/mutable');
var indent   = require('indent-string');
var repeat   = require('repeat-string');
var length   = require('string-length');
var is       = require('./utils/is');
var toString = Function.prototype.call.bind(Object.prototype.toString);

/**
 * Map of characters to escape character sequences.
 *
 * Reference: https://github.com/nodeca/js-yaml/blob/7bbbb863c9c696311d149693a34f4dec20616cc2/lib/js-yaml/dumper.js#L39-L55
 *
 * @type {Object}
 */
var ESCAPE_SEQUENCES = {};

ESCAPE_SEQUENCES[0x00]   = '\\0';
ESCAPE_SEQUENCES[0x07]   = '\\a';
ESCAPE_SEQUENCES[0x08]   = '\\b';
ESCAPE_SEQUENCES[0x09]   = '\\t';
ESCAPE_SEQUENCES[0x0A]   = '\\n';
ESCAPE_SEQUENCES[0x0B]   = '\\v';
ESCAPE_SEQUENCES[0x0C]   = '\\f';
ESCAPE_SEQUENCES[0x0D]   = '\\r';
ESCAPE_SEQUENCES[0x1B]   = '\\e';
ESCAPE_SEQUENCES[0x22]   = '\\"';
ESCAPE_SEQUENCES[0x5C]   = '\\\\';
ESCAPE_SEQUENCES[0x85]   = '\\N';
ESCAPE_SEQUENCES[0xA0]   = '\\_';
ESCAPE_SEQUENCES[0x2028] = '\\L';
ESCAPE_SEQUENCES[0x2029] = '\\P';

/**
 * Quickly check wheter a character code needs to be quoted within a string.
 *
 * Reference: https://github.com/nodeca/js-yaml/blob/7bbbb863c9c696311d149693a34f4dec20616cc2/lib/js-yaml/dumper.js#L14-L36
 *
 * @type {Object}
 */
var QUOTED_CHARACTERS = {};

QUOTED_CHARACTERS[0x09] = true; /* Tab */
QUOTED_CHARACTERS[0x0A] = true; /* LF */
QUOTED_CHARACTERS[0x0D] = true; /* CR */
QUOTED_CHARACTERS[0x21] = true; /* ! */
QUOTED_CHARACTERS[0x22] = true; /* " */
QUOTED_CHARACTERS[0x23] = true; /* # */
QUOTED_CHARACTERS[0x25] = true; /* % */
QUOTED_CHARACTERS[0x26] = true; /* & */
QUOTED_CHARACTERS[0x27] = true; /* ' */
QUOTED_CHARACTERS[0x2A] = true; /* * */
// QUOTED_CHARACTERS[0x2C] = true; /* , */
// QUOTED_CHARACTERS[0x3A] = true; /* : */
QUOTED_CHARACTERS[0x3E] = true; /* > */
QUOTED_CHARACTERS[0x40] = true; /* @ */
QUOTED_CHARACTERS[0x5B] = true; /* [ */
QUOTED_CHARACTERS[0x5D] = true; /* ] */
QUOTED_CHARACTERS[0x60] = true; /* ` */
QUOTED_CHARACTERS[0x7B] = true; /* { */
QUOTED_CHARACTERS[0x7C] = true; /* | */
QUOTED_CHARACTERS[0x7D] = true; /* } */

/**
 * Check if numbers match the YAML number pattern.
 *
 * Reference: https://github.com/nodeca/js-yaml/blob/6030fa6c389aaf14545222f7fa27e86359ca3a3b/lib/js-yaml/type/float.js#L6-L11
 *
 * @type {RegExp}
 */
var NUMBER_REGEXP = new RegExp(
  '^(?:[-+]?(?:[0-9][0-9_]*)' +
  '|[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?' +
  '|\\.[0-9_]+(?:[eE][-+][0-9]+)?' +
  '|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*' +
  '|[-+]?\\.(?:inf|Inf|INF)' +
  '|\\.(?:nan|NaN|NAN))$'
);

/**
 * Encode a character code in hex form.
 *
 * Reference: https://github.com/nodeca/js-yaml/blob/7bbbb863c9c696311d149693a34f4dec20616cc2/lib/js-yaml/dumper.js#L95-L114
 *
 * @param  {Number} charCode
 * @return {String}
 */
var encodeHex = function (charCode) {
  var string = charCode.toString(16).toUpperCase();
  var handle;
  var length;

  if (charCode <= 0xFF) {
    handle = 'x';
    length = 2;
  } else if (charCode <= 0xFFFF) {
    handle = 'u';
    length = 4;
  } else if (charCode <= 0xFFFFFFFF) {
    handle = 'U';
    length = 8;
  } else {
    throw new Error(
      'Character code within a string may not be greater than 0xFFFFFFFF'
    );
  }

  return '\\' + handle + repeat('0', length - string.length) + string;
};

/**
 * Return whether a character code needs to be escaped.
 *
 * @param  {Number}  charCode
 * @return {Boolean}
 */
var requiresEscape = function (charCode) {
  return ESCAPE_SEQUENCES[charCode] ||
    !((0x00020 <= charCode && charCode <= 0x00007E) ||
      (0x00085 === charCode)                        ||
      (0x000A0 <= charCode && charCode <= 0x00D7FF) ||
      (0x0E000 <= charCode && charCode <= 0x00FFFD) ||
      (0x10000 <= charCode && charCode <= 0x10FFFF));
};

/**
 * Check whether a string requires quotes in RAML.
 *
 * @param  {String}  str
 * @return {Boolean}
 */
var requiresQuotes = function (str) {
  // Empty strings require quotes.
  if (length(str) === 0) {
    return true;
  }

  // Check whether it's surrounded by spaces or starts with `-` or `?`.
  if (/^[ \-?]| $/.test(str) || NUMBER_REGEXP.test(str)) {
    return true;
  }

  for (var i = 0; i < str.length; i++) {
    var charCode = str.charCodeAt(i);

    if (requiresEscape(charCode)) {
      return true;
    }

    if (QUOTED_CHARACTERS[charCode]) {
      return true;
    }
  }

  return false;
};

/**
 * Escape a string to be wrapped in quotes.
 *
 * @param  {String} str
 * @return {String}
 */
var escapeString = function (str) {
  return str.split('').map(function (character) {
    var charCode = character.charCodeAt(0);

    if (requiresEscape(charCode)) {
      return ESCAPE_SEQUENCES[charCode] || escapeHex(charCode);
    }

    return character;
  }).join('');
};

/**
 * Stringify a string into RAML.
 *
 * @param  {String} str
 * @return {String}
 */
var stringifyString = function (str) {
  if (requiresQuotes(str)) {
    return '"' + escapeString(str) + '"';
  }

  return str;
};

/**
 * Check whether an inline RAML array can be rendered with the max length.
 *
 * @param  {Array}   array
 * @param  {Number}  length
 * @param  {Object}  opts
 * @return {Boolean}
 */
var arrayWithinLength = function (array, maxLength, opts) {
  // Empty arrays must always be true.
  if (!array.length) {
    return true;
  }

  // Surrounding brackets and every comma separator - "[ ... ]".
  var total = 4 + (array.length - 1) * 2;

  return array.every(function (value) {
    if (!is.primitive(value)) {
      return false;
    }

    total += length(stringify(value, 0, opts));

    return total < maxLength;
  });
};

/**
 * Stringify an array using the inline RAML format.
 *
 * @param  {Array}  array
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyArrayInline = function (array, level, opts) {
  if (!array.length) {
    return '[]';
  }

  return '[ ' + array.map(function (value) {
    return stringify(value, level, opts);
  }).join(', ') + ' ]';
};

/**
 * Check whether a string fits within the designated width.
 *
 * @param  {String}  str
 * @param  {Number}  maxLength
 * @param  {Object}  opts
 * @return {Boolean}
 */
var stringWithinLength = function (str, maxLength, opts) {
  if (/\r?\n/.test(str)) {
    return false;
  }

  return length(stringifyString(str)) < maxLength;
};

/**
 * Stringify a string into RAML with support for multiple lines.
 *
 * @param  {String} str
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyStringMultiLine = function (str, level, opts) {
  return indent(str, opts.indent, level);
};

/**
 * Generalized property stringification.
 *
 * @param  {String} prefix
 * @param  {*}      value
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyProperty = function (prefix, value, level, opts) {
  var maxLength = opts.maxLength - length(prefix) - 1;

  // Empty values can stay empty in RAML.
  if (value == null) {
    return prefix;
  }

  // Check whether the array can fit using inline representation.
  if (is.array(value) && arrayWithinLength(value, maxLength, opts)) {
    return prefix + ' ' + stringifyArrayInline(value, level + 1, opts);
  }

  // Check whether strings should be on a single line.
  if (is.string(value) && !stringWithinLength(value, maxLength, opts)) {
    return prefix + ' |\n' + stringifyStringMultiLine(value, level + 1, opts);
  }

  // Inline object representation when empty.
  if (is.object(value) && !Object.keys(value).length) {
    return prefix + ' {}';
  }

  // All other primitives will fit inline.
  if (is.primitive(value)) {
    return prefix + ' ' + stringify(value, level + 1, opts);
  }

  return prefix + '\n' + stringify(value, level + 1, opts);
};

/**
 * Stringify an object property for RAML.
 *
 * @param  {String} key
 * @param  {*}      value
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyObjectProperty = function (key, value, level, opts) {
  var prefix = repeat(opts.indent, level) + key + ':';

  return stringifyProperty(prefix, value, level, opts);
};

/**
 * Stringify an object for RAML.
 *
 * @param  {Object} obj
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyObject = function (obj, level, opts) {
  var keys = Object.keys(obj);

  return keys.map(function (key) {
    return stringifyObjectProperty(key, obj[key], level, opts);
  }).join('\n');
};

/**
 * Stringify an array property for RAML.
 *
 * @param  {*}      value
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyArrayProperty = function (value, level, opts) {
  var prefix = repeat(opts.indent, level) + '-';

  // Represent objects inline with the array token. E.g. "- schema: test".
  if (is.object(value)) {
    return prefix + ' ' + stringify(value, level + 1, opts).replace(/^ +/, '');
  }

  return stringifyProperty(prefix, value, level, opts);
};

/**
 * Stringify an array for RAML.
 *
 * @param  {Array}  array
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringifyArray = function (array, level, opts) {
  return array.map(function (value) {
    return stringifyArrayProperty(value, level, opts);
  }).join('\n');
};

/**
 * Map of types to stringify.
 *
 * @type {Object}
 */
var TYPES = {
  '[object String]':  stringifyString,
  '[object Object]':  stringifyObject,
  '[object Array]':   stringifyArray,
  '[object Number]':  String,
  '[object Boolean]': String
};

/**
 * Stringify any JavaScript type.
 *
 * @param  {*}      input
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
var stringify = function (input, level, opts) {
  var type = toString(input);

  if (!TYPES[type]) {
    return '';
  }

  return TYPES[type](input, level, opts);
};

/**
 * Stringify JavaScript to a YAML (RAML) string.
 *
 * @param  {*}      input
 * @param  {Number} level
 * @param  {Object} opts
 * @return {String}
 */
module.exports = function (input, opts) {
  return stringify(input, 0, extend({
    indent:    '  ',
    maxLength: 80
  }, opts));
};
