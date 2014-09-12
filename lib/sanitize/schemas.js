var is = require('../utils/is');

/**
 * Map the schemas array of objects into a standard array.
 *
 * @param  {Array} schemas
 * @return {Array}
 */
module.exports = function (schemas) {
  var array = [];

  // Iterate over the schema array and object and make it one schema per index.
  schemas.forEach(function (schemaMap) {
    Object.keys(schemaMap).forEach(function (key) {
      if (!is.string(schemaMap[key])) {
        return;
      }

      var obj = {};

      obj[key] = schemaMap[key];

      array.push(obj);
    });
  });

  return array;
};
