var crypto = require('../libs/crypto.js');

function getHash (req, res, next) {
    if (req.body.password) {
        req.body.password = crypto.getHash(req.body.password);
        next();
    } else {
        throw new Error('Password field required');
    }
}
exports.getHash = getHash;