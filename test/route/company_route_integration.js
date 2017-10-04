'use strict';

const CompanyModel = require('../../app/model/company');
const company = require('../../app/entity/company');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('Integration Test for COMPANY Requests: company_route_integration.js', () => {
    beforeEach((done) => {
        // Put code here
        CompanyModel.remove({}, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Cleared company info');
            }

            sinon.stub(server.request, 'isAuthenticated').callsFake(function (req, res, next) {
                return true;
            });

            setCompanyId(server, '5986b8180a8ea07f6155858d');
            done();
        });
    });

    afterEach(function () {
        server.request.isAuthenticated.restore();
    });


    it('it should GET all the companies (/api/companies)', (done) => {
        company.create(getCompany()).then(data => {}).catch(err => {
            console.log(err)
        });

        chai.request(server)
            .get('/api/companies')
            //.send(book)
            .end((err, res) => {
                let result = res.body;
                res.should.have.status(200);
                result.should.be.a('object');
                result.should.have.property('companies');
                result.companies.should.have.length.above(0);
                result.companies[0].should.have.property("name").eql("Cloud 9");

                console.log(res.body);
                done();
            });
    });


    it('it should GET compnay (/api/company)', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            companyId = data.companyId;
            setCompanyId(server, companyId);

            chai.request(server)
                .get('/api/company')
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('_id').eql(companyId.toString());
                    result.should.have.property('name').eql('Cloud 9');
                    // TODO: lechDev add the rest of properties
                    done();
                });
        }).catch(err => {
            console.log(err)
        });
    });


    it('it should PUT company (PUT/api/company', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            companyId = data.companyId;
            setCompanyId(server, companyId);

            chai.request(server)
                .put('/api/company')
                .send({
                    'company': {
                        'name': 'StudioCode'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('_id').eql(companyId.toString());
                    result.should.have.property('name').eql('StudioCode');
                    // TODO: lechDev add the rest of properties
                    done();
                });
        }).catch(err => {
            console.log(err)
        });

    });

    it('it should (POST) create a company (POST/api/company)', (done) => {
        chai.request(server)
            .post('/api/company')
            .send(JSON.parse(getCompany()))
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('companyId');
                // TODO: lechDev add the rest of properties
                done();
            });
    });


    it('it should PUT company name (PUT/api/company)', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            companyId = data.companyId;
            setCompanyId(server, companyId);

            chai.request(server)
                .put('/api/company')
                .send({
                    'company': {
                        'name': 'StudioCode'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('_id').eql(companyId.toString());
                    result.should.have.property('name').eql('StudioCode');
                    // TODO: lechDev add the rest of properties


                    chai.request(server)
                        .get('/api/company')
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = res.body;
                            result.should.be.a('object');
                            result.should.have.property('_id').eql(companyId.toString());
                            result.should.have.property('name').eql('StudioCode');
                            // TODO: lechDev add the rest of properties
                            done();
                        });
                });
        }).catch(err => {
            console.log(err)
        });

    });


    it('it should update (PUT) the preferred language', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            companyId = data.companyId;
            setCompanyId(server, companyId);

            chai.request(server)
                .put('/api/company')
                .send({
                    'company': {
                        'appSettings': {
                            'preferredLanguage': 'es'
                        }
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('appSettings');
                    result.appSettings.should.have.property('preferredLanguage').eql("es");


                    chai.request(server)
                        .get('/api/company')
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = res.body;
                            result.should.be.a('object');
                            result.should.have.property('_id').eql(companyId.toString());
                            result.appSettings.should.have.property('preferredLanguage').eql('es');
                            // TODO: lechDev add the rest of properties
                            done();
                        });
                });
        }).catch(err => {
            console.log(err)
        });
    });
});

var setCompanyId = function (server, id) {
    var user = new User();
    user.local.lang = 'en-us';
    user.local.role = 'manager';
    user.local.group = 'acc_1_out_for_service';
    user.local.companyId = id;
    server.request.user = user;
};

var getCompany = function () {
    return '{' +
        '"company": {' +
        '"customerId": "5986b8180a8ea07f6155858d",' +
        '"name": "Cloud 9",' +
        '"logo": "images/logo.png",' +
        '"location": {' +
        '"lat": 34.1022,' +
        '"lng": -118.2737' +
        '},' +
        '"appSettings": {' +
        '"preferredLanguage": "en-us",' +
        '"mapZoom": 11' +
        '}' +
        '}' +
        '}';
}
//https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai