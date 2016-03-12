Table of Contents
=================

* [Comment Parser](#comment-parser)
  * [Install](#install)
  * [Usage](#usage)
  * [Comments](#comments)
    * [Tags](#tags)
    * [Block](#block)
  * [Developer](#developer)
    * [Test](#test)
    * [Cover](#cover)
    * [Lint](#lint)
    * [Clean](#clean)
    * [Readme](#readme)

Comment Parser
==============

[<img src="https://travis-ci.org/tmpfs/cparse.svg?v=2" alt="Build Status">](https://travis-ci.org/tmpfs/cparse)
[<img src="http://img.shields.io/npm/v/cparse.svg?v=2" alt="npm version">](https://npmjs.org/package/cparse)
[<img src="https://coveralls.io/repos/tmpfs/cparse/badge.svg?branch=master&service=github&v=2" alt="Coverage Status">](https://coveralls.io/github/tmpfs/cparse?branch=master).

Fast, streaming and configurable comment parser; currently supports 30+ languages, MIT license.

Designed for polyglot programmers to:

* Combine comments from various files (HTML, CSS and Javascript for example).
* Parse comments from any language.
* Strip comments from any file.
* Separate comments into another file.
* Implement custom tag systems (annotations).
* Operate on processing instructions (see the [pi language](https://github.com/tmpfs/cparse/blob/master/API.md#pi)).
* Document JSON files, read comments then strip in build process.

## Install

```
npm i cparse
```

## Usage

Parse a string or buffer:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var cparse = require('cparse')
  , stream = cparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var cparse = require('cparse')
  , fs = require('fs')
  , stream = cparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '# @file spec.rb', {rules: require('cparse/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var cparse = require('cparse')
  , stream = cparse.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('cparse/lang/ini'), require('cparse/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

For more detail see the [api docs](https://github.com/tmpfs/cparse/blob/master/API.md).

## Comments

See [EXAMPLE.md](https://github.com/tmpfs/cparse/blob/master/EXAMPLE.md) for input and output, all the following comments resolve to the same description with the default settings:

```javascript
/** Comment description */

/**
 * Comment description
 */

/*************************
 * Comment description   *
 ************************/

// Comment description //

//
// Comment description
//
```

A comment consists of a multi-line description and optional tag annotations:

```javascript
/**
 * Method description
 * that can span multiple lines.
 *
 * @name method
 */

// Method description
// that can span multiple lines.
//
// @name method
```

### Tags

Tags allow annotating a comment with meaningful information to consumers of the comment data.

The tag parser recognises tags beginning with an `@` and is able to parse `type`, 
`value` (default), `name`, `description` and an `optional` flag.

Grammar for the default tag parser:

```
@id {type=value} [name] description
```

All fields but the tag `id` are considered optional, to set the `optional` flag 
enclose `name` in square brackets (`[]`).

When given `@property {String=mkdoc} [nickname] user` it expands to a tag object such as:

```javascript
{
  id: 'property',
  type: 'String',
  value: 'mkdoc',
  name: 'nickname',
  description: 'user',
  optional: true
}
```

See the [tag api docs](https://github.com/tmpfs/cparse/blob/master/API.md#tag) to change the tag parsing.

### Block

By default continuous single-line comments are gathered into a single `comment` object. The 
rule is that if the next line does not match whitespace followed by the start of a 
single-line comment then the block is terminated.

Note that inline comments also break the block:

```javascript
// 
// Comment description
// 
var foo; // Separate inline comment
```

Will result in two comments, whilst:

```javascript
// Comment description
// 
// More information.
```

Results in a single comment.

## Developer

### Test

To run the test suite:

```
npm test
```

### Cover

To generate code coverage run:

```
npm run cover
```

### Lint

Run the source tree through [jshint](http://jshint.com) and [jscs](http://jscs.info):

```
npm run lint
```

### Clean

Remove generated files:

```
npm run clean
```

### Readme

To build the readme file from the partial definitions (requires [mdp](https://github.com/tmpfs/mdp)):

```
npm run readme
```

Generated by [mdp(1)](https://github.com/tmpfs/mdp).

[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp
