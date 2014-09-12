# parse-header-stream

parse http or smtp headers from a stream

[![build status](https://secure.travis-ci.org/substack/parse-header-stream.png)](http://travis-ci.org/substack/parse-header-stream)

# example

## header example

``` js
var parse = require('parse-header-stream');

process.stdin.pipe(parse(function (err, headers) {
    console.log(headers);
}));
```

Given some email input:

```
Date: 23 Oct 81 11:22:33
From: SMTP@HOSTY.ARPA
To: JOE@HOSTW.ARPA
Subject: Mail System Problem

Sorry JOE, your message to SAM@HOSTZ.ARPA lost.

HOSTZ.ARPA said this:
 "550 No Such User"
```

produces:

```
{ date: '23 Oct 81 11:22:33',
  from: 'SMTP@HOSTY.ARPA',
  to: 'JOE@HOSTW.ARPA',
  subject: 'Mail System Problem' }
```

or given some http input:

```
HTTP/1.1 200 OK
server: ecstatic-0.4.13
etag: "197162-2662-Sun Aug 17 2014 20:53:29 GMT+0000 (UTC)"
last-modified: Sun, 17 Aug 2014 20:53:29 GMT
cache-control: max-age=3600
content-length: 2662
content-type: text/plain; charset=UTF-8
Date: Fri, 29 Aug 2014 10:49:08 GMT
Connection: keep-alive

 45.5%    James Halliday (substack)

    browserify     hyperspace       brfs                   deck
    hacker-deps    trumpet          glog                   hyperquest
    browser-pack   module-deps      insert-module-globals  optimist
...
```

produces:

```
{ server: 'ecstatic-0.4.13',
  etag: '"197162-2662-Sun Aug 17 2014 20:53:29 GMT+0000 (UTC)"',
  'last-modified': 'Sun, 17 Aug 2014 20:53:29 GMT',
  'cache-control': 'max-age=3600',
  'content-length': '2662',
  'content-type': 'text/plain; charset=UTF-8',
  date: 'Fri, 29 Aug 2014 10:49:08 GMT',
  connection: 'keep-alive' }
```

## body example

You can also strip the leading headers by listening for the `'body'` event:

``` js
var parse = require('parse-header-stream');
var p = process.stdin.pipe(parse());
p.on('body', function (body) {
    body.pipe(process.stdout);
});
```

Given this email data:

```
Date: 23 Oct 81 11:22:33
From: SMTP@HOSTY.ARPA
To: JOE@HOSTW.ARPA
Subject: Mail System Problem

Sorry JOE, your message to SAM@HOSTZ.ARPA lost.

HOSTZ.ARPA said this:
 "550 No Such User"
```

Produces this output:

```
Sorry JOE, your message to SAM@HOSTZ.ARPA lost.

HOSTZ.ARPA said this:
 "550 No Such User"
```

# methods

``` js
var parser = require('parse-header-stream')
```

## var stream = parser(opts={}, cb)

Return a writable `stream` that parses incoming lines for http/email style
headers. When the headers are fully read, `cb(err, headers)` fires with the
header fields or an error.

Options are:

* `opts.preserveCase` - if true, the cases of keys are preserved instead of being
converted to lower-case. Default: false
* `opts.maxLength` - maximum size for the entire header payload to be before
raising an error event

# events

## stream.on('header', function (key, value) {})

As each header is parsed, this event fires with the `key` and `value` strings.

## stream.on('headers', function (headers) {})

## stream.on('body', function (body) {})

After the header is parsed, the 'body' event fires with `body`, a stream with
all the raw data after the header.

# install

With [npm](https://npmjs.org) do:

```
npm install parse-header-stream
```

# license

MIT
