var express = require('express'),
    router = express.Router(),
    decodeToken = require('../middlewares/decodeToken.js'),
    resignToken = require('../middlewares/resignToken');

router.get('/links', decodeToken, resignToken, function (req, res, next) {
    var userShortInfo = {
        userName: req.decoded.userName,
        id: req.decoded.id
    };

    res.json({success: true, message: 'links',  user: userShortInfo});
});

module.exports = router;