var Promise = require('bluebird');
var bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));

function getHash(string) {
    return bcrypt.genSaltAsync(10).then(function(salt) {
        return bcrypt.hashAsync(string, salt, null);
    });
}

function comparePassword(string, hash) {
    return bcrypt.compareSync(string, hash);
}

exports.getHash = getHash;
exports.comparePassword = comparePassword;
