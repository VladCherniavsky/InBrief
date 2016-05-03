var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise = require('bluebird');

mongoose.connect(config.get('db:connection'));
var db = mongoose.connection;

db.on('error', function(error) {
    console.log('db connection error', error);
});

db.once('open', function() {
    console.log('db is connected');
});
module.exports = db;
