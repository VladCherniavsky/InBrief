var User = require('../models/user'),
    jwt = require('jsonwebtoken'),
    config = require('../config');

exports.signup = function (req, res, next) {
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
};

