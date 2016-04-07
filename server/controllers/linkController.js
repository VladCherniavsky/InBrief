var Link = require('../models/link'),
    jwtToken = require('../libs/jwtToken.js'),
    config = require('../config'),
    faker = require('faker');

exports.addLink = addLink;
exports.getUserLinks = getUserLinks;
exports.getAllLinks = getAllLinks;
exports.redirectToLink = redirectToLink;

function addLink (req, res, next) {

    var link = new Link ({
        originalLink: req.body.orginalLink,
        shortLink: faker.internet.password(),
        userId: req.decoded.id ? req.decoded.id : req.cookies.id,
        tags: req.body.tags
    });

    link.save()
        .then(successFunction)
        .catch(next);

    function successFunction (createdLink) {
        res.json({
            success: true,
            message: 'Link is added',
            link: createdLink
        });
    }
}

function getUserLinks (req, res, next) {
    if (req.decoded) {
        Link
            .find({userId: req.decoded.id})
            .then(function (links) {
                console.log(links);
                res.json({success: true, message: 'Users links',  links: links, user: req.user});
            })
            .catch(next);
    } else {
        res.json({success: false, message: 'Please log in'});
    }
}
function getAllLinks (req, res, next) {
    console.log('getAllLinks');
    Link
        .find()
        .then(allLinks)
        .catch(next);

    function allLinks (links) {
        console.log(links);
        if (req.decoded) {
            res.json({success: true, message: 'links',  user: req.user, links: links});
        } else {
            res.json({success: false, message: 'Please log in', links: links});
        }
    }
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
