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

  exports[name] = function (value) {
    return _toString.call(value) === type;
  };
});
