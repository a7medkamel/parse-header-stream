var parse = require('../');

process.stdin.pipe(parse(function (err, headers) {
    console.log(headers);
}));
