var hashPassword = require('../libs/crypto.js');

module.exports = function (req, res, next) {
    if (req.body.password) {
        hashPassword(req.body.password)
            .then(function (hash) {
                req.body.password = hash;
                next();
            });

    } else {
        throw new Error('Password field required');
    }
};