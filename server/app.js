var express     = require('express'),
    bodyParser  = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    morgan      = require('morgan'),
    favicon = require('serve-favicon'),
    db = require('./libs/mongoose'),
    favicon = require('serve-favicon'),
    config = require('./config');

var userRouter = require('./routes/userRouter.js'),
    redirectRouter = require('./routes/redirectRouter'),
    linkRouter = require('./routes/linkRouter.js');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(favicon(__dirname + '../../_build/img/favicon.ico'));

app.use(express.static(__dirname + '../../_build'));
app.use('/', redirectRouter);
app.use('/api', userRouter);
app.use('/api', linkRouter);

app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(err.status ? err.status : 500).json(err);
});

var port = process.env.PORT || config.get('port');
app.listen(port, function() {
    'use strict';
    console.log('server is running on port ' + port);
});

