var Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

function getHash (string) {

    return bcrypt.genSaltAsync(10).then(function(salt) {
        return bcrypt.hashAsync(string, salt, null);
    });
}

function comparePassword (string, hash) {
    bcrypt.compare(string, hash, function(err, res) {
        return res;
    });
}

exports.getHash = getHash;
exports.comparePassword = comparePassword;