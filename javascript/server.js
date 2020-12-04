https://nodejs.org/api/tls.html#tls_tls_createsecurecontext_options

'use strict';

const https = require('https');
const fs = require('fs');
const express = require('express');

const options = {
    key: fs.readFileSync('./server_tls.key'),
    cert: fs.readFileSync('./server_tls.cert'),
    ca: fs.readFileSync('./server_ca.crt'),
    minVersion: 'TLSv1.3',
    maxVersion: 'TLSv1.3'
};

const app = express();

app.use((req, res) => {
  res.writeHead(200);
  res.end("hello world\n");
});

app.listen(8000);

https.createServer(options, app).listen(8080);
console.log('Listening on 8080');
