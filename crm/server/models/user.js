var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = require('bluebird');
var nameValidator = [
    validate({
        validator: 'isLength',
        arguments: [3, 50],
        message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
    }),
    validate({
        validator: 'isAlphanumeric',
        message: 'Name should contain alpha-numeric characters only'
    })
];

var Schema = mongoose.Schema;

var user = new Schema({
    userName: {
        type: String,
        unique: 'This username already exists',
        required: true,
        trim: true,
        validate: nameValidator
    },
    email: {
        type: String,
        required: true,
        unique: 'This email already exists',
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/.test(v);
            },
            message: '{VALUE} is not a valid email!'
        }

    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

user.plugin(uniqueValidator);
var userModel = mongoose.model('User', user);
module.exports = userModel;
