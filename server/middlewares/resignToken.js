var jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

module.exports = function (req, res, next) {
    if (req.decoded) {
        var userInfo = {
            userName: req.decoded.userName,
            id: req.decoded.id
        };
        var token = jwtToken.generateToken(userInfo, config.get('key'), config.get('expirationPeriod'));
        res.setHeader('userName', req.decoded.userName);
        res.setHeader('id', req.decoded.id);
        res.setHeader('x-access-token', token);
        next();
    } else {
        next();
    }

};

