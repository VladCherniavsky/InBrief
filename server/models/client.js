var mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
    uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var client = new Schema({
    userId: {
        type: Number,
        required: true
    },
    accountName: {
        type: String,
        trim: true
    },
    clientStatus: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    clientTime: {
        type: Date
    },
    email: {
        type: String
    },
    fullPhoneNumber: {
        type: String
    },
    balance: {
        type: String
    },
    totalBonuses: {
        type: String
    },
    totalProfit: {
        type: String
    },
    totalDeposits: {
        type: String
    },
    assignedTo: {
        type: String
    }
});

client.plugin(uniqueValidator);
var clientkModel = mongoose.model('Client', client);
module.exports = clientkModel;