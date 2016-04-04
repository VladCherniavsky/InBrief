var express = require('express'),
    router = express.Router(),
    hashPassword = require('../middlewares/hashPassword'),
    authCtrl = require('../controllers/authController');

router.post('/signup', hashPassword, authCtrl.signup);

module.exports = router;