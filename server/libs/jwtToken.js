var jwt = require('jsonwebtoken'),
    config = require('../config');

exports.getToken = getToken;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;

function getToken (req) {
    return req.headers['x-access-token'];
}

function generateToken (data, key, expirationPeriod) {
    return jwt.sign(data, key, {
        expiresIn: expirationPeriod
    });
}

function verifyToken (token, key, cb) {
    jwt.verify(token, key, cb);
}