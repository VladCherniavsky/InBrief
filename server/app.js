var express     = require('express');
/*  db          = require('./lib/mongoose'),
    passport    = require('passport'),
    bodyParser  = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    morgan      = require('morgan'),
    jwt         = require('jsonwebtoken'),
    config = require('./config'),
    multer  = require('multer'),
    favicon = require('serve-favicon');*/

var app = express();
app.use(express.static(__dirname + '../../_build'));

app.get('/', function (req, res) {
    res.send('test');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    'use strict';
    console.log('server is running on port ' + port);
});

