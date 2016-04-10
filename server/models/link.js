var mongoose = require('mongoose'),
    validate = require('mongoose-validator'),
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
    description: {
        type: String,
        trim: true
    },
    tags:{
        type: [{
            type: String,
            trim: true
        }],
    },
    clicks: {
        type: Number
    }
});

link.plugin(uniqueValidator);
var linkModel = mongoose.model('Link', link);
module.exports = linkModel;