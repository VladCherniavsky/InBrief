var express = require('express');
var router = express.Router();
var checkToken = require('../middlewares/checkToken');
var decodeToken = require('../middlewares/decodeToken');
var resignToken = require('../middlewares/resignToken');
var clientController = require('../controllers/clientController');

router.post('/clients', clientController.addClient);
router.get('/clients', clientController.getAllClients);

module.exports = router;
