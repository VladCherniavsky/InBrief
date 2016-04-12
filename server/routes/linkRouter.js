var express = require('express'),
    router = express.Router(),
    checkToken = require('../middlewares/checkToken'),
    decodeToken = require('../middlewares/decodeToken'),
    resignToken = require('../middlewares/resignToken'),
    linkController = require('../controllers/linkController');


router.get('/userLinks', checkToken, linkController.getUserLinks);
router.post('/links', checkToken, linkController.addLink);
router.get('/links', decodeToken,resignToken, linkController.getAllLinks);
router.get('/links/:linkId', decodeToken,resignToken, linkController.getLinkById);
router.put('/links', checkToken, linkController.updateLink);
router.delete('/links/:linkId', checkToken, linkController.deleteLink);
router.get('/linksByTag/:tag',decodeToken,resignToken, linkController.getLinkByTag);

module.exports = router;