var mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator');

mongoose.Promise = require('bluebird');

var Schema = mongoose.Schema;

var link = new Schema({
    originalLink: {
        type: String,
        unique: 'This link already exists',
        required: true,
        trim: true
    },
    shortLink: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags:{
        type: [{
            type: String,
            trim: true
        }],
    },
    clicksInfo: {
        type: [{
            numberOfClicks:{
                type: Number
            },
            date: {
                type: Date,
                default: Date.now
            }
        }]
    }

});

link.plugin(uniqueValidator);
var linkModel = mongoose.model('Link', link);
module.exports = linkModel;