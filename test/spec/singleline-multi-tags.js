var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse singleline comment block w/ multiple tags', function(done) {
    var source = 'test/fixtures/singleline-multi-tags.js'
      , stream = parse.file(source)
      , expected = ('' + fs.readFileSync(source)).trim()
      , desc = 'var foo = \'bar\'\n  , x = \'y\';';

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(6);
      expect(comment.tags.length).to.eql(2);
      expect(comment.tags[0].tag).to.eql('usage');
      expect(comment.tags[0].description).to.eql(desc);
      expect(comment.tags[1].tag).to.eql('private');
      done();
    })
  });

});