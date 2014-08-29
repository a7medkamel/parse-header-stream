var parse = require('../');
var test = require('tape');
var fs = require('fs');

test('maximum line length', function (t) {
    t.plan(1);
    var w = parse({ maxLength: 500 });
    w.on('error', function (err) {
        t.ok(err);
    });
    w.write(Array(501+1).join('A'));
});

test('maximum header length', function (t) {
    t.plan(1);
    var w = parse({ maxLength: 500 });
    w.on('error', function (err) {
        t.ok(err);
    });
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
    w.write(Array(100+1).join('A') + '\r\n');
});
