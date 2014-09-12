var is        = exports;
var _toString = Object.prototype.toString;

[
  'String',
  'Number',
  'Boolean',
  'RegExp',
  'Object',
  'Array',
  'Function',
  'Null',
  'Undefined'
].forEach(function (instance) {
  var name = instance.charAt(0).toLowerCase() + instance.substr(1);
  var type = '[object ' + instance + ']';

  is[name] = function (value) {
    return _toString.call(value) === type;
  };
});

/**
 * Map of primitive types.
 *
 * @type {Object}
 */
var PRIMITIVES = {
  '[object Number]':    true,
  '[object String]':    true,
  '[object Boolean]':   true,
  '[object Null]':      true,
  '[object Undefined]': true
};

/**
 * Check whether a value is a primitive JavaScript type.
 *
 * @param  {*}       value
 * @return {Boolean}
 */
is.primitive = function (value) {
  return !!PRIMITIVES[_toString.call(value)];
}
