var expect = require('chai').expect
  , fs = require('fs')
  , parse = require('../../index');

describe('cparse:', function() {

  it('should parse singleline comment block w/ tag name', function(done) {
    var source = 'test/fixtures/singleline-name.js'
      , stream = parse.file(source)
      , expected = ('' + fs.readFileSync(source)).trim();

    stream.once('comment', function(comment) {
      expect(comment.source).to.eql(expected);
      expect(comment.line).to.eql(1);
      expect(comment.pos.start).to.eql(1);
      expect(comment.pos.end).to.eql(1);
      expect(comment.tags.length).to.eql(1);
      expect(comment.tags[0].tag).to.eql('function');
      expect(comment.tags[0].name).to.eql('Name');
      done();
    })
  });

});
