var Link = require('../models/link'),
    config = require('../config'),
    _ = require('lodash'),
    faker = require('faker');

exports.addLink = addLink;
exports.getUserLinks = getUserLinks;
exports.getAllLinks = getAllLinks;
exports.redirectToLink = redirectToLink;
exports.getLinkById = getLinkById;
exports.updateLink = updateLink;
exports.deleteLink = deleteLink;
exports.getLinkByTag = getLinkByTag;

function addLink (req, res, next) {
    var link = new Link ({
        originalLink: req.body.originalLink,
        shortLink: faker.internet.password(),
        userId: req.decoded.id ? req.decoded.id : req.cookies.id,
        tags: req.body.tags,
        description: req.body.description
    });

    link.save()
        .then(successAddLink)
        .catch(next);

    function successAddLink () {
        res.end();
    }
}

function getUserLinks (req, res, next) {
    var skipLimit = {skip: req.query.skip, limit: req.query.limit};
    Link.count({userId: req.decoded.id})
            .then(function (count) {
                return Link
                    .find({userId: req.decoded.id}, null, skipLimit)
                    .then(allLinks)
                    .catch(next);

                function allLinks (links) {
                    res.json({links: links, count: count});
                }
            });
}
function getAllLinks (req, res, next) {
    var skipLimit = {skip: req.query.skip, limit: req.query.limit};
    var select = {originalLink: 1, shortLink: 1, description: 1, tags: 1, clicks: 1};

    Link.count({})
        .then(function (count) {
            return Link
                .find({}, select, skipLimit)
                .then(allLinks)
                .catch(next);

            function allLinks (links) {
                res.json({links: links, count: count});
            }
        });
}
function redirectToLink (req, res, next) {
    Link
        .findOneAndUpdate({shortLink: req.params.shortLink}, {$inc: {clicks: 1}})
        .then(function (link) {
            if (link) {
                res.redirect(link.originalLink);
            }
        })
        .catch(next);

}
function getLinkById (req, res, next) {
    Link
        .findOne({_id: req.params.linkId})
        .then(function (link) {
            Link.aggregate({$match: {
                    $and: [
                        {userId: link.userId}
                    ]
                }},
                {$group: {_id : null, sum : {$sum: '$clicks'}}}, function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({link: link, sum: result[0].sum});
                    }
                });
        })
        .catch(next);
}
function updateLink (req, res, next) {
    console.log(req.decoded)
    Link
        .findOneAndUpdate({_id: req.body._id}, {$set: _.pick(req.body, ['tags', 'description', 'originalLink'])})
        .then(function () {
            res.end();
        })
        .catch(next);
}
function deleteLink (req, res, next) {
    Link
        .remove({_id: req.params.linkId})
        .then(function () {
            res.end();
        })
        .catch(next);

}
function getLinkByTag (req, res, next) {
    Link.count({tags: req.params.tag})
        .then(function (count) {
            return Link
                .find({tags: req.params.tag}, null, null)
                .then(allLinks)
                .catch(next);

            function allLinks (links) {
                res.json({links: links, count: count});
            }
        });
}