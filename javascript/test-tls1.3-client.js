'use strict';

const https = require('https');
const tls = require('tls');
const _ = require('lodash');


const tls13Ciphers = [
    'TLS_AES_256_GCM_SHA384',       // 'TLS_AES_256_GCM_SHA384',
    'TLS_CHACHA20_POLY1305_SHA256', // 'TLS_CHACHA20_POLY1305_SHA256',
    'TLS_AES_128_GCM_SHA256',       // 'TLS_AES_128_GCM_SHA256',
    'TLS_AES_128_CCM_SHA256',       // 'TLS_AES_128_CCM_SHA256',
    'TLS_AES_128_CCM_8_SHA256'      // 'TLS_AES_128_CCM_8_SHA256'
];

const nonTlsCiphers = [
    'ECDHE_ECDSA_WITH_AES_256_GCM_SHA384',  // ecdhe-ecdsa-aes256-gcm-sha384
    'ECDHE_RSA_WITH_AES_256_GCM_SHA384',    // ecdhe-rsa-aes256-gcm-sha384
    'ECDHE_ECDSA_WITH_AES_256_CBC_SHA384',  // ecdhe-ecdsa-aes256-sha384
    'ECDHE_RSA_WITH_AES_256_CBC_SHA384',    // ecdhe-rsa-aes256-sha384
    'ECDHE_ECDSA_WITH_AES_256_CBC_SHA',     // ecdhe-ecdsa-aes256-sha
    'ECDHE_RSA_WITH_AES_256_CBC_SHA',       // ecdhe-rsa-aes256-sha
    'DHE_DSS_WITH_AES_256_GCM_SHA384',      // dhe-dss-aes256-gcm-sha384
    'DHE_RSA_WITH_AES_256_GCM_SHA384',      // dhe-rsa-aes256-gcm-sha384
    'DHE_RSA_WITH_AES_256_CBC_SHA256',      // dhe-rsa-aes256-sha256
    'DHE_DSS_WITH_AES_256_CBC_SHA256',      // dhe-dss-aes256-sha256
    'DHE_RSA_WITH_AES_256_CBC_SHA',         // dhe-rsa-aes256-sha
    'DHE_DSS_WITH_AES_256_CBC_SHA',         // dhe-dss-aes256-sha
    'RSA_WITH_AES_256_GCM_SHA384',          // aes256-gcm-SHA384
    'RSA_WITH_AES_256_CBC_SHA256'          // AES256-SHA256
];


// this converts the display format to node/tls format
const defaultConvertDisplayFormatToNodeFormat = {
    TLS_AES_256_GCM_SHA384: 'TLS_AES_256_GCM_SHA384',
    TLS_CHACHA20_POLY1305_SHA256: 'TLS_CHACHA20_POLY1305_SHA256',
    TLS_AES_128_GCM_SHA256: 'TLS_AES_128_GCM_SHA256',
    TLS_AES_128_CCM_SHA256: 'TLS_AES_128_CCM_SHA256',
    TLS_AES_128_CCM_8_SHA256: 'TLS_AES_128_CCM_8_SHA256',

    ECDHE_ECDSA_WITH_AES_256_GCM_SHA384: 'ECDHE-ECDSA-AES256-GCM-SHA384',
    ECDHE_RSA_WITH_AES_256_GCM_SHA384: 'ECDHE-RSA-AES256-GCM-SHA384',
    ECDHE_ECDSA_WITH_AES_256_CBC_SHA384: 'ECDHE-ECDSA-AES256-SHA384',
    ECDHE_RSA_WITH_AES_256_CBC_SHA384: 'ECDHE-RSA-AES256-SHA384',
    ECDHE_ECDSA_WITH_AES_256_CBC_SHA: 'ECDHE-ECDSA-AES256-SHA',
    ECDHE_RSA_WITH_AES_256_CBC_SHA: 'ECDHE-RSA-AES256-SHA',

    DHE_DSS_WITH_AES_256_GCM_SHA384: 'DHE-DSS-AES256-GCM-SHA384',
    DHE_RSA_WITH_AES_256_GCM_SHA384: 'DHE-RSA-AES256-GCM-SHA384',
    DHE_RSA_WITH_AES_256_CBC_SHA256: 'DHE-RSA-AES256-SHA256',
    DHE_DSS_WITH_AES_256_CBC_SHA256: 'DHE-DSS-AES256-SHA256',
    DHE_RSA_WITH_AES_256_CBC_SHA: 'DHE-RSA-AES256-SHA',
    DHE_DSS_WITH_AES_256_CBC_SHA: 'DHE-DSS-AES256-SHA',

    RSA_WITH_AES_256_GCM_SHA384: 'AES256-GCM-SHA384',
    RSA_WITH_AES_256_CBC_SHA256: 'AES256-SHA256',
    RSA_WITH_AES_256_CBC_SHA: 'AES256-SHA',

    ECDHE_ECDSA_WITH_AES_128_GCM_SHA256: 'ECDHE-ECDSA-AES128-GCM-SHA256',
    ECDHE_RSA_WITH_AES_128_GCM_SHA256: 'ECDHE-RSA-AES128-GCM-SHA256',
    ECDHE_ECDSA_WITH_AES_128_CBC_SHA256: 'ECDHE-ECDSA-AES128-SHA256',
    ECDHE_RSA_WITH_AES_128_CBC_SHA256: 'ECDHE-RSA-AES128-SHA256',
    ECDHE_ECDSA_WITH_AES_128_CBC_SHA: 'ECDHE-ECDSA-AES128-SHA',
    ECDHE_RSA_WITH_AES_128_CBC_SHA: 'ECDHE-RSA-AES128-SHA',

    DHE_DSS_WITH_AES_128_GCM_SHA256: 'DHE-DSS-AES128-GCM-SHA256',
    DHE_RSA_WITH_AES_128_GCM_SHA256: 'DHE-RSA-AES128-GCM-SHA256',
    DHE_RSA_WITH_AES_128_CBC_SHA256: 'DHE-RSA-AES128-SHA256',
    DHE_DSS_WITH_AES_128_CBC_SHA256: 'DHE-DSS-AES128-SHA256',
    DHE_RSA_WITH_AES_128_CBC_SHA: 'DHE-RSA-AES128-SHA',
    DHE_DSS_WITH_AES_128_CBC_SHA: 'DHE-DSS-AES128-SHA',
    RSA_WITH_AES_128_GCM_SHA256: 'AES128-GCM-SHA256',
    RSA_WITH_AES_128_CBC_SHA256: 'AES128-SHA256',
    RSA_WITH_AES_128_CBC_SHA: 'AES128-SHA'
};
// _.join(convertCipherToNodeVersion(ciphers), ':');

function convertCipherToNodeVersion(tlsOptionsCiphers) {
    for (let cipher in tlsOptionsCiphers) {
        tlsOptionsCiphers[cipher] = defaultConvertDisplayFormatToNodeFormat[tlsOptionsCiphers[cipher]];
    }
    return tlsOptionsCiphers;
}


var options = {
    // 1.2
    host: 'httpbin.org',
    path: '/get',

    // 1.2 and 1.3
    // host: 'google.com',
    // path: '/',

    // 1.2 and 1.3
    // host: 'www.cdn77.com',
    // path: '/tls-test',

    port: 443,
    method: 'GET',
    rejectUnauthorized: false,
    // secureProtocol: 'TLSv1_2_method',
    minVersion: 'TLSv1.2',
    maxVersion: 'TLSv1.3',
    enableTrace: true,
    ciphers: _.join(convertCipherToNodeVersion(tls13Ciphers), ':')
};


https.request(options, res => {
    let body = '';
    res.on('data', data => body += data);
    res.on('end', () => {
        // console.log('response data: ' + body);
    });
}).on('error', err => {
    console.warn(err);
}).end();

// https://www.cdn77.com/tls-test
// https://google.com
// NODE_DEBUG='tls,http' node app.js
