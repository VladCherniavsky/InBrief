var Link = require('../models/link'),
    jwtToken = require('../libs/jwtToken.js'),
    config = require('../config'),
    faker = require('faker');

exports.addLink = addLink;
exports.getUserLinks = getUserLinks;
exports.getAllLinks = getAllLinks;
exports.redirectToLink = redirectToLink;
exports.linkDetails = linkDetails;

function addLink (req, res, next) {

    var link = new Link ({
        originalLink: req.body.orginalLink,
        shortLink: faker.internet.password(),
        userId: req.decoded.id ? req.decoded.id : req.cookies.id,
        tags: req.body.tags
    });

    link.save()
        .then(successAddLink)
        .catch(next);

    function successAddLink (createdLink) {
        res.json('Link is added');
    }
}

function getUserLinks (req, res, next) {
    if (req.decoded) {
        Link
            .find({userId: req.decoded.id}, {shortLink: 1, clicks: 1})
            .then(function (userLinks) {
                console.log(userLinks);
                res.json(userLinks);
            })
            .catch(next);
    } else {
        res.json('You dont have links');
    }
}
function getAllLinks (req, res, next) {
    console.log('getAllLinks');
    var select = {shortLink: 1, clicks: 1, _id: 1};
    var skipLimit = {skip: 5, limit: 10};

    Link.count({})
        .then(function (count) {
            return Link
                .find({}, select, skipLimit)
                .then(allLinks)
                .catch(next);

            function allLinks (links) {
                console.log('links', links);
                console.log('count', count);
                res.json({links: links, count: count});
            }
        });
}
function redirectToLink (req, res, next) {
    console.log(req.params);
    Link
        .findOneAndUpdate({shortLink: req.params.shortLink}, {$inc: {clicks: 1}})
        .then(function (link) {
            if (link) {
                res.redirect(link.originalLink);
            }
        })
        .catch(next);

}
function linkDetails (req, res, next) {

}
