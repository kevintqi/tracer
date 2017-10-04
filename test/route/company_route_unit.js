'use strict';

const company = require('../../app/entity/company');
const taskMapper = require('../../app/task/task_mapper');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('Route Test for company: company_route_unit.js', () => {
    beforeEach(function () {
        sinon.stub(server.request, 'isAuthenticated').callsFake(function (req, res, next) {
            return true;
        });

        var user = new User();
        user.local.lang = 'en-us';
        user.local.role = 'manager';
        user.local.group = 'acc_1_out_for_service';
        user.local.companyId = '5986b8180a8ea07f6155858d';
        server.request.user = user;
    });

    afterEach(function () {
        server.request.isAuthenticated.restore();
    });

    it('it should GET all the companies (/api/companies)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.getCompanies);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve(getJson()));
        chai.request(server)
            .get('/api/companies')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('companies');
                result.companies[0].should.have.property('name').eql(
                    'lechDev XXXX:)'
                );
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    it('it should GET company (/api/company)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.getCompany);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve(getJson()));

        chai.request(server)
            .get('/api/company')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('companies');
                result.companies[0].should.have.property('logo');
                result.companies[0].should.have.property('location');
                result.companies[0].should.have.property('name').eql('lechDev XXXX:)');
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    it('it should GET compnay by id (/company/<company id>', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.getCompanyById);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve(getCompany()));

        chai.request(server)
            .get('/api/company/123')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('customerId');
                result.should.have.property('name').eql('Cloud 9');
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });

    });

    it('it should (POST) create a company (POST/api/company)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.createCompany);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve('{ "companyId": 1357 }'));

        chai.request(server)
            .post('/api/company')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('companyId').eql(1357);
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });


    it('it should (PUT) update company (PUT/api/company)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.updateCompany);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve('{ "companyId": 1357 }'));

        chai.request(server)
            .put('/api/company')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('companyId').eql(1357);
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });


    it('it should (PUT) update company (PUT/api/company)(LANGUAGE)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.updateCompany);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve('{ "language": "es" }'));

        chai.request(server)
            .put('/api/company')
            .send({
                'preferredLanguage': 'es'
            })
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.have.property('language').eql("es");
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });
});


var getJson = function () {
    return '{"companies":[{"_id":"5993c0c6db979e55240ac213",' +
        '"logo":"images/logo.png","name":"lechDev XXXX:)",' +
        '"customerId":"5986b8180a8ea07f6155858d","__v":0,' +
        '"updated":"2017-08-16T03:49:26.304Z",' +
        '"appSettings":{"mapMinZoom":13,"mapZoom":11,"preferredLanguage":"en-us"},' +
        '"location":{"lng":-118.2737,"lat":34.1022}}]}';
}

var getCompany = function () {
    return '{' +
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
        '}';
}

//https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai