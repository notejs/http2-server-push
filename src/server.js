const fs = require('fs');
const http2 = require('http2');
const path = require('path');

const server = http2.createSecureServer({
    key: fs.readFileSync('./localhost-privkey.pem'),
    cert: fs.readFileSync('localhost-cert.pem')
});

server.on('error', (err) => {
    console.log(err);
})

server.on('stream', (stream, headers) => {
    if ('/' === headers[':path']) {
        stream.respondWithFile(path.resolve(__dirname, '../public/index.html'));
        stream.pushStream({':path': '/index.js'}, (err, pushStream, headers) => {
            if (err) {
                throw err;
            }

            pushStream.respondWithFile(path.resolve(__dirname, '../public/push.js'))
        });
    } else if (/\.js$/.test(headers[':path'])) {
        stream.respondWithFile(path.resolve(__dirname, '../public' + headers[':path']), {
            'content-Type': 'application/javascript'
        });
    } else {

    }
    
    
})

server.listen(8443)
