var express = require('express'),
    router = express.Router(),
    decodeToken = require('../middlewares/decodeToken.js'),
    resignToken = require('../middlewares/resignToken');

router.get('/links', decodeToken, resignToken);
router.get('/links', decodeToken, resignToken);
module.exports = router;