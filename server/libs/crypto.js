var Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'));



function getHash (string) {
        return bcrypt.hashAsync(string, null, null);
}

function compareHashes (string, hash) {
    return bcrypt.compare(string, hash, function () {
    });
}

exports.getHash = getHash;
exports.compareHashes = compareHashes;