var bcrypt = require('bcryptjs');

function getHash (string) {
    var salt = bcrypt.genSaltSync(10);
    return  bcrypt.hashSync(string, salt);
}

function comparePassword (string, hash) {
    return bcrypt.compareSync(string, hash);
}

exports.getHash = getHash;
exports.comparePassword = comparePassword;