var parse = require('../');
var test = require('tape');
var fs = require('fs');

test('no break', function (t) {
    t.plan(1);
    var w = parse();
    w.on('headers', function (headers) {
        t.deepEqual(headers, {
            foo: '111',
            bar: '222',
            baz: '333'
        });
    });
    w.write('foo: 111\r\n');
    w.write('bar: 222\r\n');
    w.write('baz: 333');
    w.end();
});
