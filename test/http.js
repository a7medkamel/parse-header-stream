var parse = require('../');
var test = require('tape');
var fs = require('fs');

test('http', function (t) {
    var keys = [
        'server',
        'etag',
        'last-modified',
        'cache-control',
        'content-length',
        'content-type',
        'date',
        'connection'
    ];
    var expected = {
        server: 'ecstatic-0.4.13',
        etag: '"197162-2662-Sun Aug 17 2014 20:53:29 GMT+0000 (UTC)"',
        'last-modified': 'Sun, 17 Aug 2014 20:53:29 GMT',
        'cache-control': 'max-age=3600',
        'content-length': '2662',
        'content-type': 'text/plain; charset=UTF-8',
        date: 'Fri, 29 Aug 2014 10:49:08 GMT',
        connection: 'keep-alive'
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
    fs.createReadStream(__dirname + '/data/http.txt').pipe(w);
});
