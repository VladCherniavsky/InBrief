var Link = require('../models/link'),
    jwtToken = require('../libs/jwtToken.js'),
    config = require('../config'),
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
    console.log('body',req.body);

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

    function successAddLink (createdLink) {
        res.end();
    }
}

function getUserLinks (req, res, next) {
    if (req.decoded) {
        var skipLimit = {skip: req.query.skip, limit: req.query.limit};
        Link.count({userId: req.decoded.id})
            .then(function (count) {
                return Link
                    .find({userId: req.decoded.id}, null, skipLimit)
                    .then(allLinks)
                    .catch(next);

                function allLinks (links) {
                    console.log('links', links);
                    console.log('count', count);
                    res.json({links: links, count: count});
                }
            });
    }
    else {
        res.end();
    }
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
function getLinkById (req, res, next) {
    Link
        .findOne({_id: req.params.linkId})
        .then(function (link) {
            console.log('LINK', link);
            Link.aggregate({$match: {
                    $and: [
                        {userId: link.userId}
                    ]
                }},
                {$group: {_id : null, sum : {$sum: '$clicks'}}}, function (err, result) {
                    if (err) {
                        next(err);
                    } else {
                        console.log('sum', result);
                        res.json({link: link, sum: result[0].sum});
                    }
                });
        })
        .catch(next);
}
function updateLink (req, res, next) {
    console.log('update', req.body);
    Link
        .findOneAndUpdate({_id: req.body._id}, {$set: {
            tags: req.body.tags,
            description: req.body.description,
            originalLink: req.body.originalLink
        }})
        .then(function (link) {
            res.end();
        })
        .catch(next);
}
function deleteLink (req, res, next) {
    console.log('req.params', req);
    Link
        .remove({_id: req.params.linkId})
        .then(function (data) {
            console.log('data', data);
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
                console.log('links', links);
                console.log('count', count);
                res.json({links: links, count: count});
            }
        });
}