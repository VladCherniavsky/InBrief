var express = require('express'),
    router = express.Router(),
    hashPassword = require('../middlewares/hashPassword'),
    authCtrl = require('../controllers/authController');

router.post('/signup', hashPassword.getHash, authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;