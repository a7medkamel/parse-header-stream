var parse = require('../');
var test = require('tape');
var fs = require('fs');

test('email', function (t) {
    var keys = [ 'date', 'from', 'to', 'subject' ];
    var expected = {
        date: '23 Oct 81 11:22:33',
        from: 'SMTP@HOSTY.ARPA',
        to: 'JOE@HOSTW.ARPA',
        subject: 'Mail System Problem'
    };
    t.plan(3 + keys.length * 2);
    
    var w = parse(function (err, headers) {
        t.ifError(err);
        t.deepEqual(headers, expected);
    });
    w.on('header', function (key, value) {
        t.equal(key, keys.shift());
        t.equal(value, expected[key]);
    });
    w.on('headers', function (headers) {
        t.deepEqual(headers, expected);
    });
    fs.createReadStream(__dirname + '/data/email.txt').pipe(w);
});
