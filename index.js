var split = require('split');
var through = require('through2');

module.exports = function (opts, cb) {
    if (!opts) opts = {};
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    var len = 0;
    var stream = split(undefined, undefined, {
        maxLength: opts.maxLength
    });
    var headers = {};
    var parsed = false;
    
    stream.pipe(through(function (buf, enc, next) {
        if (parsed) return next();
        
        len += buf.length;
        if (opts.maxLength && len > opts.maxLength) {
            stream.emit('error', new Error('too much header data'));
        }
        
        var line = buf.toString('utf8').replace(/\r$/);
        var m;
        if (line === '') {
            parsed = true;
            stream.emit('headers', headers);
            headers = undefined;
        }
        else if (m = /^(\S+)\s*:\s*(.+)/.exec(line)) {
            var key = m[1], value = m[2];
            if (!opts.preserveCase) {
                key = key.toLowerCase();
            }
            headers[key] = value;
            stream.emit('header', key, value);
        }
        next();
    }));
    
    if (cb) {
        stream.once('headers', function (h) { cb(null, h) });
        stream.once('error', cb);
    }
    return stream;
};
