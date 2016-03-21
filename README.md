# Comment Parser

[![Build Status](https://travis-ci.org/mkdoc/mkparse.svg?v=3)](https://travis-ci.org/mkdoc/mkparse)
[![npm version](http://img.shields.io/npm/v/mkparse.svg?v=3)](https://npmjs.org/package/mkparse)
[![Coverage Status](https://coveralls.io/repos/mkdoc/mkparse/badge.svg?branch=master&service=github&v=3)](https://coveralls.io/github/mkdoc/mkparse?branch=master)

> Parses comments

Fast, streaming and configurable comment parser; currently supports 30+ languages.

Designed for polyglot programmers to:

* Combine comments from various files (HTML, CSS and Javascript for example)
* Parse comments from any language
* Strip comments from any file
* Separate comments into another file
* Implement custom tag systems (annotations)
* Operate on processing instructions (see the [pi language](git+https://github.com/mkdoc/mkparse/blob/master/API.md#pi))
* Document JSON files, read comments then strip in build process

See the [i/o sample](git+https://github.com/mkdoc/mkparse/blob/master/EXAMPLE.md) and the [api docs](git+https://github.com/mkdoc/mkparse/blob/master/API.md).

## Install

```
npm i mkparse --save
```

For the command line interface install [mkdoc][] globally (`npm i -g mkdoc`).

## Usage

Parse a string or buffer:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse('/**Compact comment*/');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Load and parse file contents:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.load('index.js');
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Parse and write comment data to file as newline delimited JSON:

```javascript
var mkparse = require('mkparse')
  , fs = require('fs')
  , stream = mkparse.load('index.js').stringify();
stream.pipe(fs.createWriteStream('index-ast.json.log'));
```

Use a language pack:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse(
      '# @file spec.rb', {rules: require('mkparse/lang/ruby')});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

Combine language pack rules:

```javascript
var mkparse = require('mkparse')
  , stream = mkparse.parse(
      '; ini style comment\n# shell style comment',
      {rules: [require('mkparse/lang/ini'), require('mkparse/lang/shell')]});
stream.on('comment', function(comment) {
  console.dir(comment);
});
```

For more detail see the [api docs](git+https://github.com/mkdoc/mkparse/blob/master/API.md).

## Comments

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

All the following comments resolve to the same description with the default settings:

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

See the [tag api docs](git+https://github.com/mkdoc/mkparse/blob/master/API.md#tag) to change the tag parsing.

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

## License

MIT

Generated by [mkdoc](https://github.com/mkdoc/mkdoc).

[mkdoc]: https://github.com/mkdoc/mkdoc
[jshint]: http://jshint.com
[jscs]: http://jscs.info
[mdp]: https://github.com/tmpfs/mdp

