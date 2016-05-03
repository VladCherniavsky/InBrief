var express = require('express');
var router = express.Router();
var linkController = require('../controllers/linkController');

router.get('/:shortLink', linkController.redirectToLink);

module.exports = router;
