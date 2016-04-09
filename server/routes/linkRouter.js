var express = require('express'),
    router = express.Router(),
    checkToken = require('../middlewares/checkToken'),
    decodeToken = require('../middlewares/decodeToken'),
    resignToken = require('../middlewares/resignToken'),
    linkController = require('../controllers/linkController');

router.use(decodeToken,resignToken);

router.get('/userLinks', linkController.getUserLinks);
router.post('/links', checkToken, linkController.addLink);
router.get('/links', linkController.getAllLinks);
router.get('/links/:linkId', linkController.getLinkById);
router.put('/links', linkController.updateLink);
router.delete('/links/:linkId', linkController.deleteLink);

module.exports = router;