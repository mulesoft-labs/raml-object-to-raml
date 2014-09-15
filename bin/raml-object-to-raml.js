var concat = require('concat-stream');
var toRAML = require('./');

process.stdin.pipe(concat(function (data) {
  console.log(toRAML(JSON.parse(data.toString())));
}));
