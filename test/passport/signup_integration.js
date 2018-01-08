'use strict';;

const assert = require('chai').assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const userModel = require('../../app/model/user');
const should = chai.should();

chai.use(chaiHttp);

describe('INTEGRATION TEST for signup: signup_integration.js', () => {
    beforeEach((done) => {
        userModel.remove({}, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Cleared all users');
            }
        });

        done();
    });

    afterEach(function () {});

    it('it should (POST) create a new user , 200 code (/signup)', (done) => {
        chai.request(server)
            .post('/signup')
            .send(JSON.parse(getUserJson()))
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('status').eql('success');

                // Check if it was saved user was saved in the database
                userModel.findOne({
                    'local.email': 'ruben@sebeca-usa.com' 
                }, function (err, user) {
                    // if there are any errors, return the error
                    if (err)
                        assert(false); 

                    assert.isOk(user);
                    assert(user._doc.local.email === 'ruben@sebeca-usa.com'); 
                    assert(user._doc.local.lang === 'en-us'); 
                    assert(user._doc.local.role === 'admin'); 
                    assert(user._doc.local.group === 'acc1'); 
                    assert(user._doc.local.companyId === '5986b8180a8ea07f6155858d'); 
                });


                done();
            });
    });

    it('it should (POST) with error 400 - bad request (/signup)', (done) => {
        // Missing companyId make it a 400 error
        let postArg = {
            'email': 'ruben@sebeca-usa.com',
            'password': '123',
            'lang': 'en-us',
            'role': 'admin',
            'group': 'acc1',
        }
        chai.request(server)
            .post('/signup')
            .send(postArg)
            .end((err, res) => {
                res.should.have.status(400);
                done();
            });
    });

    it('it should (POST) with error 409 - Conflict (/signup)', (done) => {
        // 409 means the email was already used in another profile
        chai.request(server)
            .post('/signup')
            .send(JSON.parse(getUserJson()))
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('status').eql('success');

                chai.request(server)
                    .post('/signup')
                    .send(JSON.parse(getUserJson()))
                    .end((err, res) => {
                        res.should.have.status(409);
                        done();
                    });

            });
    });
});

var getUserJson = function () {
    return '{' +
        '"email": "ruben@sebeca-usa.com",' +
        '"password": "123",' +
        '"lang": "en-us",' +
        '"role": "admin",' +
        '"group": "acc1",' +
        '"companyId": "5986b8180a8ea07f6155858d"' +
    '}';
}