var jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

module.exports = function (req, res, next) {
    var token = jwtToken.getToken(req);
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
        next();
    }
};