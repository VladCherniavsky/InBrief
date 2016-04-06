var Link = require('../models/link'),
    jwtToken = require('../libs/jwtToken.js'),
    config = require('../config'),
    faker = require('faker');

exports.addLink = addLink;
exports.getUserLinks = getUserLinks;
exports.getAllLinks = getAllLinks;

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
        res.setHeader('x-access-token', req.token);
        res.json({
            success: true,
            message: 'Link is added',
            link: createdLink
        });
    }
}

function getUserLinks (req, res, next) {
    if (req.decoded) {
        console.log('here');
        var userShortInfo = {
            userName: req.decoded.userName,
            id: req.decoded.id
        };

        Link
            .find({userId: req.decoded.id})
            .then(function (links) {
                console.log(links);
                res.setHeader('x-access-token', req.token);
                res.json({success: true, message: 'Users links',  links: links});
            })
            .catch(next);
    } else {
        res.json({success: false, message: 'Please log in'});
    }
}
function getAllLinks (req, res, next) {
    Link
        .find()
        .then(allLinks)
        .catch(next);

    function allLinks (links) {
        if (req.decoded) {
            var userShortInfo = {
                userName: req.decoded.userName,
                id: req.decoded.id
            };
            res.setHeader('x-access-token', req.token);
            res.json({success: true, message: 'links',  user: userShortInfo, links: links});
        } else {
            res.json({success: false, message: 'Please log in', links: links});
        }
    }
}
