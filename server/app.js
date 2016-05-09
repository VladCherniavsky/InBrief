var express     = require('express');
var bodyParser  = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var db = require('./libs/mongoose');
var config = require('./config');

var clientRouter = require('./routes/clientRouter');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(morgan('dev'));
app.use(favicon(__dirname + '../../_build/img/favicon.ico'));

app.use(express.static(__dirname + '../../_build'));
app.use('/api', clientRouter);

app.use(function(err, req, res, next) {
    console.log(err);
    return res.status(err.status ? err.status : 500).json(err);
});

var port = process.env.PORT || config.get('port');
app.listen(port, function() {
    console.log('server is running on port ' + port);
});

module.exports = app;

