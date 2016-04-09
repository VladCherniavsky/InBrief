var User = require('../models/user'),
    crypto = require('../libs/crypto.js'),
    jwtToken = require('../libs/jwtToken.js'),
    config = require('../config');

exports.signup = signup;
exports.login = login;

function signup (req, res, next) {

    var user = new User({
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password
    });

    user.save()
        .then(successSignup)
        .catch(next);

    function successSignup(user) {
        res.json('User is registered');
    }
}

function login (req, res, next) {
    User
        .findOne({email: req.body.email})
        .then(successLogin)
        .catch(next);

    function successLogin (user) {
        console.log('login request', user);
        var error;
        if (!user) {
            error = new Error ();
            error.message = 'Authentication failed. User not found with this email';
            error.status = 404;
            next(error);
        } else if (!crypto.comparePassword(req.body.password, user.password)) {
            error = new Error ();
            error.message = 'Authentication failed. Wrong password';
            next(error);
        } else {
            var userInfo = {
                userName: user.userName,
                id: user._id
            };
            var token = jwtToken.generateToken(userInfo, config.get('key'),config.get('expirationPeriod'));
            res.setHeader('userName', user.userName);
            res.setHeader('id', user._id);
            res.setHeader('x-access-token', token);
            res.json('You are logged in');
        }
    }
}