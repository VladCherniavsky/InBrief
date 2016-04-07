var express = require('express'),
    router = express.Router(),
    checkToken = require('../middlewares/checkToken'),
    decodeToken = require('../middlewares/decodeToken'),
    resignToken = require('../middlewares/resignToken'),
    linkController = require('../controllers/linkController');

router.use(decodeToken,resignToken);

router.get('/home', linkController.getUserLinks);
router.post('/links', checkToken, linkController.addLink);
router.get('/links', linkController.getAllLinks);
router.get('/:shortLink', linkController.redirectToLink);

module.exports = router;