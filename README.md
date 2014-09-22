# RAML Object To RAML

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]

Takes a RAML object in JavaScript and emits properly-formatted RAML (text).

## Installation

```
npm install raml-object-to-raml --save
```

## Usage

### CLI

Supports piping in JSON and printing the resulting RAML to stdout.

```
cat api.json | raml-object-to-raml > api.raml
```

### JavaScript

The module can be required inside other projects for generating the RAML file directly from JavaScript objects.

```javascript
var toRAML = require('raml-object-to-raml');

console.log(toRAML({ ... }));
// #%RAML 0.8
// title: Example API
// ...
```

## License

Apache 2.0

[npm-image]: https://img.shields.io/npm/v/raml-object-to-raml.svg?style=flat
[npm-url]: https://npmjs.org/package/raml-object-to-raml
[travis-image]: https://img.shields.io/travis/mulesoft/raml-object-to-raml.svg?style=flat
[travis-url]: https://travis-ci.org/mulesoft/raml-object-to-raml
[coveralls-image]: https://img.shields.io/coveralls/mulesoft/raml-object-to-raml.svg?style=flat
[coveralls-url]: https://coveralls.io/r/mulesoft/raml-object-to-raml?branch=master
