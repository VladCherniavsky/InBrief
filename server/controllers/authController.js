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
        .then(successFunction)
        .catch(next);

    function successFunction (user) {
        console.log('User saved successfully');
        console.log(user);
        res.json({
            success: true,
            message: 'User is registered',
            user: user
        });
    }
}

function login (req, res, next) {
    User
        .findOne({email: req.body.email})
        .then(success)
        .catch(next);

    function success (user) {
        console.log('login request', user);
        if (!user) {
            res.json({success: false, message: 'Authentication failed. User not found'});
        } else if (!crypto.comparePassword(req.body.password, user.password)) {
            res.json({success: false, message: 'Authentication failed. Wrong password'});
        } else {
            var userShortInfo = {
                id: user._id,
                userName: user.userName
            };

            var token = jwtToken.generateToken(userShortInfo, config.get('key'),config.get('expirationPeriod'));
            res.setHeader('x-access-token', token);
            res.json({success: true, message: 'Loged in',  user: userShortInfo});
        }

    }
}