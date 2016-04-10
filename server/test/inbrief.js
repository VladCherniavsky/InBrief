var expect = require('chai').expect,
    request = require('supertest'),
    faker = require('faker'),
    app = require('../app');

describe('authentication to service', function () {
    describe('signup user', function () {
        it('register user to service', function (done) {
            this.timeout(15000);
            setTimeout(done, 15000);
            request(app)
                .post('/api/signup')
                .send({
                    userName: faker.internet.userName(),
                    email: faker.internet.email(),
                    password: faker.internet.password()
                })
                .expect(200)
                .end(function(err, res) {
                    if (err) { return done(err) }
                    done();
                });

        });
    });
    describe('login user,', function () {
        it('login user to service', function (done) {
            request(app)
                .post('/api/login')
                .send({
                    email: 'test@gmail.com',
                    password: 'test'
                })
                .expect(200)
                .end(function(err, res) {

                    if (err) { return done(err) }
                    expect(res.header.id).to.equal('570a642e89db7c3c08a68eb5');
                    done();
                });

        });
    });
});
describe('get links', function () {
    describe('return  all links', function () {
        it('all links', function (done) {
            request(app)
                .get('/api/links')
                .expect(200)
                .end(function(err, res) {
                    if (err) { return done(err) }
                    done();
                });
        });
    });
});