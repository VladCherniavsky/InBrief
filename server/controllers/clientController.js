var Client = require('../models/client'),
    config = require('../config'),
    _ = require('lodash'),
    faker = require('faker');

exports.getAllClients = getAllClients;
exports.addClient = addClient;

function getAllClients(req, res, next) {
    console.log('req', req);
    Client.count({})
        .then(function(count) {
            return Client
                .find({})
                .then(allClients)
                .catch(next);

            function allClients(clients) {
                console.log('clients', clients);
                res.json({clients: clients, count: count});
            }
        });
}

function addClient(req, res, next) {
    var client = new Client({
        userId: 111111,
        accountName: faker.finance.accountName(),
        clientStatus: faker.random.boolean(),
        country: faker.address.county(),
        clientTime: Date.now(),
        email: faker.internet.email(),
        fullPhoneNumber: faker.phone.phoneNumber(),
        balance: faker.finance.amount(),
        totalBonuses: faker.finance.amount(),
        totalProfit: faker.finance.amount(),
        totalDeposits: faker.finance.amount(),
        assignedTo: faker.name.findName()
    });
    client.save()
        .then(successAddLink)
        .catch(next);

    function successAddLink(insertedUser) {
        res.json(insertedUser);
    }
}
