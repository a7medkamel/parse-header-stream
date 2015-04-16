var through = require('through2');
var Readable = require('readable-stream').Readable;

module.exports = function (opts, cb) {
    if (!opts) opts = {};
    if (typeof opts === 'function') {
        cb = opts;
        opts = {};
    }
    var hlen = 0;
    var headers = {};
    var parsed = false;
    var body = null;
    var prev = null;

    var stream = through(write, end);
    if (cb) {
        stream.once('headers', function (h, meta) { cb(null, h, meta) });
        stream.once('error', cb);
    }
    return stream;

    function write (buf, enc, next) {
        if (parsed) {
            if (body) body.push(buf);
            return next();
        }

        if (prev) buf = Buffer.concat([ prev, buf ]);
        hlen += buf.length + 1;

        if (opts.maxLength && hlen > opts.maxLength) {
            return stream.emit('error', new Error('too much header data'));
        }

        var last = 0;
        for (var i = 0; i < buf.length; i++) {
            if (parsed) break;
            if (buf[i] !== 10) continue;
            online(buf.slice(last, i));
            last = i + 1;
        }

        if (parsed) {
            prev = null;
            if (stream.listeners('body').length > 0) {
                body = new Readable;
                body._read = function () {};
                body.push(buf.slice(last, buf.length));
                stream.emit('body', body);
            }
        }
        else prev = buf.slice(last, buf.length);
        next();
    }

    function online (buf) {
        var line = buf.toString('utf8').replace(/\r$/, '');
        var m;
        if (line === '') {
            parsed = true;
            stream.emit('headers', headers, { size: hlen });
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
        else if (m = /^HTTP\/(.+)\s(\d+)\s(.+)$/.exec(line)) {
            var ver = m[1], code = m[2], text = m[3];
            stream.emit('http', { version : ver, code : code, text : text });
        }
    }
    function end () {
        if (!parsed) {
            if (prev) online(prev);
            online(new Buffer(0));
        }
        this.push(null);
        if (body) body.push(null);
    }
};
