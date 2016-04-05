var express     = require('express'),
    bodyParser  = require('body-parser'),
    cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
    morgan      = require('morgan'),
    favicon = require('serve-favicon'),
    db = require('./libs/mongoose'),
    config = require('./config');

var userRouter = require('./routes/userRouter.js'),
    linkRouter = require('./routes/linkRouter.js');

var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));
//app.use(favicon(__dirname + '../../public/assets/favicon.ico'))

app.use(express.static(__dirname + '../../_build'));
app.use('/api', userRouter);
app.use('/api', linkRouter);

app.use(function(err, req, res, next) {
    console.log('app.err', err);
    return res.status(err.status ? err.status : 500).json({success:false, error: err});
});

var port = process.env.PORT || config.get('port');
app.listen(port, function() {
    'use strict';
    console.log('server is running on port ' + port);
});

