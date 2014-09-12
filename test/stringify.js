var expect = require('chai').expect;
var toRAML = require('../');

describe('raml object to raml', function () {
  var RAML_PREFIX = '#%RAML 0.8';

  describe('base parameters', function () {
    it('title', function () {
      var str = toRAML({
        title: 'Example API'
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'title: Example API'
      ].join('\n'));
    });

    it('base uri', function () {
      var str = toRAML({
        baseUri: 'http://example.com'
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'baseUri: http://example.com'
      ].join('\n'));
    });

    it('media type', function () {
      var str = toRAML({
        mediaType: 'application/json'
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'mediaType: application/json'
      ].join('\n'));
    });

    it('version', function () {
      var str = toRAML({
        version: 'v1.0'
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'version: v1.0'
      ].join('\n'));
    });

    it('base uri parameters', function () {
      var str = toRAML({
        baseUriParameters: {
          domain: {
            type: 'string',
            default: 'api'
          }
        }
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'baseUriParameters:',
        '  domain:',
        '    type: string',
        '    default: api'
      ].join('\n'));
    });

    it('security schemes', function () {
      var str = toRAML({
        securitySchemes: [{
          oauth_2_0: {
            type: 'OAuth 2.0',
            settings: {
              authorizationUri: 'https://github.com/login/oauth/authorize',
              accessTokenUri: 'https://github.com/login/oauth/access_token',
              authorizationGrants: [
                'code'
              ],
              scopes: [
                'user',
                'user:email',
                'user:follow',
                'public_repo',
                'repo',
                'repo:status',
                'delete_repo',
                'notifications',
                'gist'
              ]
            }
          }
        }]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'securitySchemes:',
        '  - oauth_2_0:',
        '      type: OAuth 2.0',
        '      settings:',
        '        authorizationUri: https://github.com/login/oauth/authorize',
        '        accessTokenUri: https://github.com/login/oauth/access_token',
        '        authorizationGrants: [ code ]',
        '        scopes:',
        '          - user',
        '          - user:email',
        '          - user:follow',
        '          - public_repo',
        '          - repo',
        '          - repo:status',
        '          - delete_repo',
        '          - notifications',
        '          - gist'
      ].join('\n'));
    });

    it('schemas', function () {
      var str = toRAML({
        schemas: [
          {
            labels: '{\n    \"$schema\": \"http://json-schema.org/draft-03/schema\",\n    \"type\": \"array\",\n    \"list\": [\n      {\n        \"properties\": {\n          \"url\": {\n            \"type\": \"string\"\n          },\n          \"name\": {\n            \"type\": \"string\"\n          },\n          \"color\": {\n            \"type\": \"string\",\n            \"maxLength\": 6,\n            \"minLength\": 6\n          }\n        },\n        \"type\": \"object\"\n      }\n    ]\n}'
          },
          {
            labelsBody: '{\n  \"required\": true,\n  \"$schema\": \"http://json-schema.org/draft-03/schema\",\n  \"type\": \"array\",\n  \"items\": [\n    {\n      \"type\": \"string\"\n    }\n  ]\n}'
          }
        ]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'schemas:',
        '  - labels: |',
        '      {',
        '          "$schema": "http://json-schema.org/draft-03/schema",',
        '          "type": "array",',
        '          "list": [',
        '            {',
        '              "properties": {',
        '                "url": {',
        '                  "type": "string"',
        '                },',
        '                "name": {',
        '                  "type": "string"',
        '                },',
        '                "color": {',
        '                  "type": "string",',
        '                  "maxLength": 6,',
        '                  "minLength": 6',
        '                }',
        '              },',
        '              "type": "object"',
        '            }',
        '          ]',
        '      }',
        '  - labelsBody: |',
        '      {',
        '        "required": true,',
        '        "$schema": "http://json-schema.org/draft-03/schema",',
        '        "type": "array",',
        '        "items": [',
        '          {',
        '            "type": "string"',
        '          }',
        '        ]',
        '      }'
      ].join('\n'));
    });

    it('documentation', function () {
      var str = toRAML({
        documentation: [
          {
            title: 'Home',
            content: 'Welcome to the _Zencoder API_ Documentation. The _Zencoder API_ allows you to connect your application to our encoding service and encode videos without going through the web  interface. You may also benefit from one of our [integration libraries](https://app.zencoder.com/docs/faq/basics/libraries) for different languages.'
          }
        ]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'documentation:',
        '  - title: Home',
        '    content: |',
        '      Welcome to the _Zencoder API_ Documentation. The _Zencoder API_ allows you to connect your application to our encoding service and encode videos without going through the web  interface. You may also benefit from one of our [integration libraries](https://app.zencoder.com/docs/faq/basics/libraries) for different languages.'
      ].join('\n'));
    });

    it('resource types', function () {
      var str = toRAML({
        resourceTypes: [{
          item: {
            'delete?': {
              responses: {
                '204': {
                  description: 'Item removed.'
                }
              }
            },
            'post?':  null,
            'put?':   null,
            'get?':   null,
            'patch?': null,
            type:     'base'
          }
        }]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'resourceTypes:',
        '  - item:',
        '      delete?:',
        '        responses:',
        '          204:',
        '            description: Item removed.',
        '      post?:',
        '      put?:',
        '      get?:',
        '      patch?:',
        '      type: base'
      ].join('\n'));
    });

    it('traits', function () {
      var str = toRAML({
        traits: [{
          state: {
            queryParameters: {
              state: {
                description: 'String to filter by state.',
                enum: [
                  'open',
                  'closed'
                ],
                default: 'open',
                displayName: 'state',
                type: 'string'
              }
            }
          }
        }]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        'traits:',
        '  - state:',
        '      queryParameters:',
        '        state:',
        '          type: string',
        '          description: String to filter by state.',
        '          enum: [ open, closed ]',
        '          default: open'
      ].join('\n'));
    });

    it('resources', function () {
      var str = toRAML({
        resources: [{
          type: 'collection',
          relativeUri: '/users',
          methods: [{
            headers: {
              Accept: {
                description: 'Used to set the specified media type.',
                displayName: 'Accept'
              }
            },
            method: 'get',
            responses: {
              '200': {
                body: {
                  'application/json': {
                    schema: 'search-users'
                  }
                }
              }
            },
            queryParameters: {
              sort: {
                description: 'If not provided, results are sorted by best match.',
                enum: ['followers', 'repositories', 'joined']
              }
            }
          }],
          resources: [{
            type: 'base',
            relativeUri: '/{userId}',
            methods: [{
              method: 'get'
            }]
          }]
        }]
      });

      expect(str).to.equal([
        RAML_PREFIX,
        '/users:',
        '  type: collection',
        '  get:',
        '    headers:',
        '      Accept:',
        '        description: Used to set the specified media type.',
        '    queryParameters:',
        '      sort:',
        '        description: If not provided, results are sorted by best match.',
        '        enum: [ followers, repositories, joined ]',
        '    responses:',
        '      200:',
        '        body:',
        '          application/json:',
        '            schema: search-users',
        '  /{userId}:',
        '    type: base',
        '    get: {}'
      ].join('\n'));
    });
  });
});
