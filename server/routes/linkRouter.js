var express = require('express');
var router = express.Router();
var checkToken = require('../middlewares/checkToken');
var decodeToken = require('../middlewares/decodeToken');
var resignToken = require('../middlewares/resignToken');
var linkCtrl = require('../controllers/linkController');

router.get('/userLinks', checkToken, linkCtrl.getUserLinks);
router.post('/links', checkToken, linkCtrl.addLink);
router.get('/links', decodeToken, resignToken, linkCtrl.getAllLinks);
router.get('/links/:linkId', decodeToken, resignToken, linkCtrl.getLinkById);
router.put('/links', checkToken, linkCtrl.updateLink);
router.delete('/links/:linkId', checkToken, linkCtrl.deleteLink);
router.get('/linksByTag/:tag', decodeToken, resignToken, linkCtrl.getLinkByTag);

module.exports = router;
