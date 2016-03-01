var parser = require('../index')
  , json = Boolean(~process.argv.indexOf('--json'))
  , opts = {dotted: true}
  , stream = parser.load(process.argv[2], opts);
  //, stream = parser.parse('/**foo*/', opts);

if(!json) {
  stream.on('comment', function(comment) {
    console.dir(comment)
  });
}else{
  stream = stream.stringify(parseInt(process.env.INDENT));
  stream.pipe(process.stdout);
}

stream.on('end', function() {
  //console.dir('ended');
});

stream.on('finish', function() {
  //console.dir('finished');
});
