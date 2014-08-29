var parse = require('../');
var test = require('tape');
var fs = require('fs');

test('parse', function (t) {
    t.plan(1);
    var w = parse();
    w.on('headers', function (headers) {
        t.deepEqual(headers, {
            foo: '111',
            bar: '222'
        });
    });
    w.write('foo: 111\r\n');
    w.write('bar: 222\r\n');
    w.write('\r\nbaz: 333\r\n');
});
