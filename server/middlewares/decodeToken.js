var jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

module.exports = function (req, res, next) {
    console.log('decodeToken middlaware');
    var token = jwtToken.getToken(req);
    if (token) {
        jwtToken.verifyToken(token, config.get('key'), function (err, decoded) {
            if (err) {
                return res.json({
                    success:false,
                    message:'Failed to authenticate token',
                    error:err
                });
            } else {
                req.decoded = decoded;
                console.log('req.decoded', req.decoded);
                next();
            }
        });
    } else {
        next();
    }
};