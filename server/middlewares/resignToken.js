var jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

module.exports = function (req, res, next) {
    console.log('resign token middlaware');
    if (req.decoded) {
        var userInfo = {
            userName: req.decoded.userName,
            id: req.decoded.id
        };
        var token = jwtToken.generateToken(userInfo, config.get('key'),config.get('expirationPeriod'));
        res.setHeader('Authorization: JWT <token>', token);
        req.token = token;
        next();
    }
};