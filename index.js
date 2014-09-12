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
    
    stream.pipe(through(write, end));
    
    function write (buf, enc, next) {
        if (parsed) return next();
        
        len += buf.length + 1;
        if (opts.maxLength && len > opts.maxLength) {
            stream.emit('error', new Error('too much header data'));
        }
        
        var line = buf.toString('utf8').replace(/\r$/);
        var m;
        if (line === '') {
            parsed = true;
            stream.emit('headers', headers, { size: len });
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
    }
    function end () {
        if (!parsed) write(new Buffer(0), 'binary', function () {});
        this.push(null);
    }
    
    if (cb) {
        stream.once('headers', function (h, meta) { cb(null, h, meta) });
        stream.once('error', cb);
    }
    return stream;
};
