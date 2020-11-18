'use strict';

const express = require('express');
const fs = require('fs');
const https = require('https');
const bodyParser = require('body-parser');

var sslOptions = {
    ca: fs.readFileSync('./ca.crt').toString(),
    key: fs.readFileSync('./tls.key').toString(),
    cert: fs.readFileSync('./tls.crt').toString()
};

const port = 3088;

let app;
let server;

startServer();

app.use(setRefererToNull); 
function setRefererToNull(req, res, next) {
    req.headers.referer = null;
    next();
}

async function startServer() {
    app = new express();

    server = https.createServer(sslOptions, app).listen(port, function() {
        console.log('server is listening on ' + port + '.');
    });
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
}

app.get('*', async function(req, res) {
    console.log(' [GET] request: ' + req.path + ' : ' + JSON.stringify(req.headers));
    res.append('referrer-policy', 'no-referrer');
    res.append('access-control-allow-credentials', true);
    res.append('access-control-allow-origin', req.headers.origin);
    res.append('Content-Type', 'application/json');
    res.send({ greeting: 'hello world' });
    res.status(200).end();
    return;
});

app.options('*', async function(req, res) {
    console.log(' [OPTIONS] request: ' + req.path);
    res.append('access-control-allow-credentials', true);
    res.append('access-control-allow-headers', 'authorization');
    res.append('access-control-allow-methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.append('access-control-allow-origin', req.headers.origin);
    res.append('access-control-max-age', 3600);
    res.append('allow', 'GET, OPTIONS, HEAD');
    res.append('content-type', 'text/html; charset=utf-8');
    res.append('content-length', 0);
    res.status(200).end();
});
