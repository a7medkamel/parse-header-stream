var parse = require('../');
var p = process.stdin.pipe(parse());
p.on('body', function (body) {
    body.pipe(process.stdout);
});
