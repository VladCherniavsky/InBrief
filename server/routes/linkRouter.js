var express = require('express'),
    router = express.Router(),
    checkToken = require('../middlewares/checkToken'),
    decodeToken = require('../middlewares/decodeToken'),
    resignToken = require('../middlewares/resignToken'),
    linkController = require('../controllers/linkController');

router.get('/', decodeToken, resignToken, linkController.getUserLinks);
router.post('/links', checkToken, resignToken, linkController.addLink);
router.get('/links', decodeToken, resignToken, linkController.getAllLinks);

module.exports = router;