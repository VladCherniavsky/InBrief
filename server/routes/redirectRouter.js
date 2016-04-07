var express = require('express'),
    router = express.Router(),
    linkController = require('../controllers/linkController');

router.get('/:shortLink', linkController.redirectToLink);

module.exports = router;