var jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

module.exports = function (req, res, next) {
    console.log('checkToken middlaware');
    var token = jwtToken.getToken(req);
    console.log('token', token);
    if (token) {
        jwtToken.verifyToken(token, config.get('key'), function (err, decoded) {
            if (err) {
                next(err);
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        return res.status(401).json(new Error('Failed to authenticate token. Please log in'));
    }
};