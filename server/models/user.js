var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var user = new Schema({
    userName: {
        type: String,
        unique: 'This username already exists',
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
});

user.plugin(uniqueValidator);
var userModel = mongoose.model('User', user);
module.exports = userModel;