var express = require('express'),
    router = express.Router(),
    checkToken = require('../middlewares/checkToken'),
    decodeToken = require('../middlewares/decodeToken'),
    resignToken = require('../middlewares/resignToken'),
    clientController = require('../controllers/clientController');

router.post('/clients', clientController.addClient);
router.get('/clients', clientController.getAllClients);

module.exports = router;
