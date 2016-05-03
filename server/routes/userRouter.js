var express = require('express');
var router = express.Router();
var hashPassword = require('../middlewares/hashPassword');
var authCtrl = require('../controllers/authController');

router.post('/signup', hashPassword.getHash, authCtrl.signup);
router.post('/login', authCtrl.login);

module.exports = router;
