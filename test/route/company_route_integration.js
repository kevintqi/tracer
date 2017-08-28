'use strict';

const CompanyModel = require('../../app/model/company');
const company = require('../../app/entity/company');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let should = chai.should();

chai.use(chaiHttp);

describe('Integration Test', () => {
    beforeEach((done) => {
        // Put code here
        CompanyModel.remove({}, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Cleared company info');
            }
            done();
        });
    });


    describe('/GET/companies', () => {
        it('it should GET all the companies', (done) => {
            company.create(getCompany()).then(data => {
                console.log('created company');
            }).catch(err => {
                console.log(err)
            });

            chai.request(server)
                .get('/companies')
                //.send(book)
                .end((err, res) => {
                    let result = JSON.parse(res.body);
                    res.should.have.status(200);
                    result.should.be.a('object');
                    result.should.have.property('companies');
                    result.companies.should.have.length.above(0);
                    result.companies[0].should.have.property("name").eql("Cloud 9");

                    console.log(res.body);
                    done();
                });
        });
    });
});

describe('/GET/company?customer_id=123', () => {
    it('it should GET compnay by customer id', (done) => {
        company.create(getCompany()).then(data => {
            console.log('created company');

        }).catch(err => {
            console.log(err)
        });

        chai.request(server)
            .get('/company?customer_id=5986b8180a8ea07f6155858d')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('customerId');
                result.should.have.property('name').eql('Cloud 9');
                // TODO: lechDev add the rest of properties
                done();
            });
    });
});

describe('/GET/company/123', () => {
    it('it should GET compnay by company id', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            const companyObj = JSON.parse(data);
            companyId = companyObj.companyId;

            chai.request(server)
                .get('/company/' + companyId)
                //.send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = JSON.parse(res.body);
                    result.should.be.a('object');
                    result.should.have.property('customerId');
                    result.should.have.property('name').eql('Cloud 9');
                    // TODO: lechDev add the rest of properties
                    done();
                });

        }).catch(err => {
            console.log(err)
        });
    });

    it('it should PUT company by customer id', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            const companyObj = JSON.parse(data);
            companyId = companyObj.companyId;
            chai.request(server)
                .put('/company')
                .query({
                    company_id: companyId
                })
                .send({
                    'company': {
                        'name': 'StudioCode'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = JSON.parse(res.body);
                    result.should.be.a('object');
                    result.should.have.property('_id').eql(companyId);
                    result.should.have.property('name').eql('StudioCode');
                    // TODO: lechDev add the rest of properties
                    done();
                });
        }).catch(err => {
            console.log(err)
        });

    });
});


describe('/POST/company', () => {
    it('it should (POST) create a company', (done) => {
        chai.request(server)
            .post('/company')
            .send(JSON.parse(getCompany()))
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('companyId');
                // TODO: lechDev add the rest of properties
                done();
            });
    });
});

describe('/PUT/company?company_id=123', () => {
    it('it should PUT compnay by customer id', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            const companyObj = JSON.parse(data);
            companyId = companyObj.companyId;
            chai.request(server)
                .put('/company')
                .query({
                    company_id: companyId
                })
                .send({
                    'company': {
                        'name': 'StudioCode'
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = JSON.parse(res.body);
                    result.should.be.a('object');
                    result.should.have.property('_id').eql(companyId);
                    result.should.have.property('name').eql('StudioCode');
                    // TODO: lechDev add the rest of properties


                    chai.request(server)
                        .get('/company/' + companyId)
                        //.send(book)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = JSON.parse(res.body);
                            result.should.be.a('object');
                            result.should.have.property('_id').eql(companyId);
                            result.should.have.property('name').eql('StudioCode');
                            // TODO: lechDev add the rest of properties
                            done();
                        });
                });
        }).catch(err => {
            console.log(err)
        });

    });
});

describe('/PATCH/company/123/app_settings/preferred_language', () => {
    it('it should PATCH the preferred language', (done) => {
        var companyId;
        company.create(getCompany()).then(data => {
            const companyObj = JSON.parse(data);
            companyId = companyObj.companyId;
            chai.request(server)
                .patch('/company/' + companyId + '/app_settings/preferred_language')
                //.query({
                //    company_id: companyId
                //})
                .send({
                    'preferredLanguage': 'es'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = JSON.parse(res.body);
                    result.should.be.a('object');
                    result.should.have.property('language').eql("es");


                    chai.request(server)
                        .get('/company/' + companyId)
                        //.send(book)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = JSON.parse(res.body);
                            result.should.be.a('object');
                            result.should.have.property('_id').eql(companyId);
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