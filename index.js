var fs = require('fs')
  //, assert = require('assert')
  , EOL = require('os').EOL
  , through = require('through3')
  , LineStream = require('stream-lines');

function Comment(opts) {
  opts = opts || {};

  this.rules = opts.rules || require('./c');

  //assert(this.rules, 'unsupported comment language ' + opts.lang);

  // current list of comment lines
  this.current = null;

  // current raw source string
  this.source = null;

  // current line number
  this.line = 1;

  // current comment start line number
  this.start = 0;
}

/**
 *  Comment transform stream.
 *
 *  Parse a comment from an array of lines.
 *
 *  @function comment
 *  @param {Array} chunk array of lines to process.
 */
function comment(chunk, encoding, cb) {
  var i
    , line
    , block;

  function find(line) {
    for(var k in this.rules) {
      if(this.rules[k].start(line)) {
        this.current = [line]; 
        return this.rules[k];
      }
    }
  }

  function reset() {
    this.current = null;
    this.rule = null;
    this.start = 0;
  }

  for(i = 0;i < chunk.length;i++) {
    line = chunk[i];
    if(!this.current) {
      this.rule = find.call(this, line); 
      this.start = this.line;
      if(this.rule) {

        // set up comment block
        block = {
            lines: this.current,
            rule: this.rule,
            start: this.start,
            end: this.line};

        // handles comments that terminate on the same line
        if(this.rule.end(line)) {
          this.push(block);
          reset.call(this);
          continue;
        }
      }
    }else{
      if(this.rule && this.rule.end(line)) {
        if(this.rule.last) {
          this.current.push(line);
        }
        block.end = this.rule.last ? this.line : (this.line - 1);
        this.push(block);
        reset.call(this);
      }else{
        this.current.push(line);
      }
    }
    this.line++;
  }
  cb();
}

function Parser(opts) {
  opts = opts || {};

  // pattern that determines if we have encountered a tag
  this.rule = opts.rule instanceof RegExp
    ? opts.rule : /^\s*@/;

  // extraction pattern for matched tags
  this.pattern = opts.pattern instanceof RegExp
    ? opts.pattern : /^\s*@(\w+)\s?(\{(\w+)\})?\s?(\[?\w+\]?)?\s?(.*)?/;

  // pattern that determines optionality
  this.optional = opts.optional instanceof RegExp
    ? opts.optional : /^\[([^\]]+)\]$/;

  // whether to trim leading and trailing whitespace from descriptions
  // for intermediary lines use `whitespace`
  this.trim = typeof opts.trim === 'boolean' ? opts.trim : true;

  function parse(line, tag) {
    function replacer(match, id, typedef, type, name, description) {
      tag.tag = id;
      tag.type = type || '';
      tag.name = name || '';
      tag.description = description || '';
    }

    line.replace(this.pattern, replacer);
    tag.optional = this.optional.test(tag.name);

    if(tag.optional) {
      tag.name = tag.name.replace(this.optional, '$1'); 
    }

    return tag;
  }

  // pattern that strips leading whitespace from description lines
  this.whitespace = opts.whitespace instanceof RegExp
    ? opts.whitespace : /^\s{1,1}/

  this.parse = opts.parse instanceof Function
    ? opts.parse : parse;
}

/**
 *  Parse comment description and tags.
 */
function parser(chunk, encoding, cb) {
  var lines = chunk.rule.strip(chunk.lines)
    , i
    , line
    , comment = {
        source: chunk.lines.join(EOL),
        description: '',
        line: chunk.start,
        pos: {start: chunk.start, end: chunk.end},
        tags: []
      }
    , seen = false
    , result;

  //console.dir(chunk.lines);

  function parse(start, index, lineno) {
    var tag = {
        tag: '',
        type: '',
        optional: false,
        line: lineno,
        source: start
      }
      , line;

    this.parse.call(this, start, tag);
    for(var i = index + 1;i < lines.length;i++) {
      line = lines[i];
      if(this.rule.test(lines[i])) {
        break
      }else{
        if(tag.description) {
          line = line.replace(this.whitespace, ''); 
        }
        tag.description += line + EOL;
        index++;
      }
      tag.source += lines[i] + EOL;
    }

    if(this.trim) {
      tag.description = tag.description.trim(); 
    }

    return {tag: tag, end: index};
  }

  for(i = 0;i < lines.length;i++) {
    line = lines[i];
    seen = this.rule.test(line);
    if(seen) {
      result = parse.call(this, line, i, chunk.start + i);
      comment.tags.push(result.tag);
      i = result.end;
      seen = true;
    }else if(!seen) {
      if(comment.description) {
        line = line.replace(this.whitespace, ''); 
        line = EOL + line;
      }
      comment.description += line; 
    }
  }

  if(this.trim) {
    comment.description = comment.description.trim(); 
  }

  this.emit('comment', comment);
  this.push(comment);
  cb();
}

var Comment = through.transform(comment, {ctor: Comment})
var Parser = through.transform(parser, {ctor: Parser})

function file(path, opts) {
  var source = fs.createReadStream(path); 
  return source
    .pipe(new LineStream(opts))
    .pipe(new Comment(opts))
    .pipe(new Parser(opts));
}

module.exports = {
  file: file
}
