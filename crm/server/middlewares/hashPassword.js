var crypto = require('../libs/crypto.js');

function getHash(req, res, next) {
    console.log(req.body);
    if (req.body.password) {
        crypto
            .getHash(req.body.password)
            .then(function(hash) {
                req.body.password = hash;
                next();
            })
            .catch(next);
    } else {
        throw new Error('Password field required');
    }
}
exports.getHash = getHash;
