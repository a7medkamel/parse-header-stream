var parse = require('../');
process.stdin.pipe(parse()).on('body', console.log);
