var express = require('express');
var router = express.Router();
var hashPassword = require('../middlewares/hashPassword');
var authCtrl = require('../controllers/authController');
var decodeToken = require('../middlewares/decodeToken');
var resignToken = require('../middlewares/resignToken');

router.post('/signup', hashPassword.getHash, authCtrl.signup);
router.post('/login', authCtrl.login);
router.get('/default', decodeToken, resignToken, authCtrl.defaultHandler);

module.exports = router;
