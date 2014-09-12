var parse = require('../');
var test = require('tape');
var fs = require('fs');
var concat = require('concat-stream');

var expected = [
    'Sorry JOE, your message to SAM@HOSTZ.ARPA lost.',
    '',
    'HOSTZ.ARPA said this:',
    ' "550 No Such User"',
    ''
].join('\n');

test('body', function (t) {
    t.plan(1);
    var w = parse();
    w.on('body', function (body) {
        body.pipe(concat(function (buf) {
            t.equal(buf.toString('utf8'), expected);
        }));
    });
    fs.createReadStream(__dirname + '/data/email.txt').pipe(w);
});
