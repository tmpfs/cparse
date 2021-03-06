# Comment Parser Example

---

- [Input](#input)
- [Output](#output)

---

## Input

```javascript
/**Short multi-line comment*/

/*
 *  Comment is ignored, single leading asterisk.
 */

// Single-line comment

// 
// Super fly
//
// @public {function} getNinja super fly stuff.
// @param {Object} [opts] configuration options.
// @returns {Object} a command line ninja.

/**
 * @usage
 *
 * var x = 'y'
 *   , v = 'w';
 */

/**
 *  @object point.x
 *  @object point.x.y.z
 */

function request(url, opts /** @param {Object} opts request options */){}

const foo = 'bar';  // @private {String} foo private constant
```

## Output

```json
{
  "source": "/**Short multi-line comment*/",
  "description": "Short multi-line comment",
  "line": 1,
  "pos": {
    "start": 1,
    "end": 1
  },
  "newline": true,
  "tags": [],
  "file": "test/example.js"
}
{
  "source": "// Single-line comment",
  "description": "Single-line comment",
  "line": 7,
  "pos": {
    "start": 7,
    "end": 7
  },
  "newline": true,
  "tags": [],
  "file": "test/example.js"
}
{
  "source": "// \n// Super fly\n//\n// @public {function} getNinja super fly stuff.\n// @param {Object} [opts] configuration options.\n// @returns {Object} a command line ninja.",
  "description": "Super fly",
  "line": 9,
  "pos": {
    "start": 9,
    "end": 14
  },
  "newline": true,
  "tags": [
    {
      "id": "public",
      "type": "function",
      "optional": false,
      "line": 12,
      "source": "@public {function} getNinja super fly stuff.",
      "name": "getNinja",
      "value": "",
      "body": "getNinja super fly stuff.",
      "description": "super fly stuff."
    },
    {
      "id": "param",
      "type": "Object",
      "optional": true,
      "line": 13,
      "source": "@param {Object} [opts] configuration options.",
      "name": "opts",
      "value": "",
      "body": "[opts] configuration options.",
      "description": "configuration options."
    },
    {
      "id": "returns",
      "type": "Object",
      "optional": false,
      "line": 14,
      "source": "@returns {Object} a command line ninja.",
      "name": "a",
      "value": "",
      "body": "a command line ninja.",
      "description": "command line ninja."
    }
  ],
  "file": "test/example.js"
}
{
  "source": "/**\n * @usage\n *\n * var x = 'y'\n *   , v = 'w';\n */",
  "description": "",
  "line": 16,
  "pos": {
    "start": 16,
    "end": 21
  },
  "newline": true,
  "tags": [
    {
      "id": "usage",
      "optional": false,
      "line": 17,
      "source": "@usage\n var x = 'y'\n   , v = 'w';\n \n",
      "name": "",
      "value": "",
      "body": "",
      "description": "var x = 'y'\n , v = 'w';"
    }
  ],
  "file": "test/example.js"
}
{
  "source": "/**\n *  @object point.x\n *  @object point.x.y.z\n */",
  "description": "",
  "line": 23,
  "pos": {
    "start": 23,
    "end": 26
  },
  "newline": true,
  "tags": [
    {
      "id": "object",
      "line": 24,
      "name": "point",
      "type": "",
      "description": "",
      "tags": [
        {
          "id": "object",
          "optional": false,
          "line": 24,
          "source": "@object point.x",
          "name": "x",
          "value": "",
          "body": "point.x",
          "description": "",
          "tags": [
            {
              "id": "object",
              "line": 25,
              "name": "y",
              "type": "",
              "description": "",
              "tags": [
                {
                  "id": "object",
                  "optional": false,
                  "line": 25,
                  "source": "@object point.x.y.z \n",
                  "name": "z",
                  "value": "",
                  "body": "point.x.y.z",
                  "description": ""
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "file": "test/example.js"
}
{
  "source": "/** @param {Object} opts request options */",
  "description": "",
  "line": 28,
  "pos": {
    "start": 28,
    "end": 28
  },
  "newline": false,
  "tags": [
    {
      "id": "param",
      "type": "Object",
      "optional": false,
      "line": 28,
      "source": "@param {Object} opts request options ",
      "name": "opts",
      "value": "",
      "body": "opts request options ",
      "description": "request options"
    }
  ],
  "file": "test/example.js"
}
{
  "source": "// @private {String} foo private constant",
  "description": "",
  "line": 30,
  "pos": {
    "start": 30,
    "end": 30
  },
  "newline": true,
  "tags": [
    {
      "id": "private",
      "type": "String",
      "optional": false,
      "line": 30,
      "source": "@private {String} foo private constant",
      "name": "foo",
      "value": "",
      "body": "foo private constant",
      "description": "private constant"
    }
  ],
  "file": "test/example.js"
}
```

---

Created by [mkdoc](https://github.com/mkdoc/mkdoc) on January 3, 2017

