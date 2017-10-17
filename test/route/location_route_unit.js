'use strict';

const locationLog = require('../../app/entity/location_log');
const taskMapper = require('../../app/task/task_mapper');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('/route/location_route_unit.js', () => {
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

    it('it should GET all the location logs (/api/location_logs)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.getLocationLogs);
        taskMapperMock.expects('fnc').once().returns(
            Promise.resolve(logsJson));
        chai.request(server)
            .get('/api/location_logs')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('locationLogs');
                result.locationLogs[0].should.have.property('companyId').eql('5986b8180a8ea07f6155858d');
                result.locationLogs[0].should.have.property('jobId').eql('5986b8180a8ea07f61558999');
                result.locationLogs[0].should.have.property('dateLog').eql('2017-08-16T03:49:26.304Z');
                result.locationLogs[0].should.have.property('location');
                result.locationLogs[0].location.should.have.property('lat').eql(34.1022);
                result.locationLogs[0].location.should.have.property('lng').eql(-118.2737);
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    it('it should GET location logs by job id (/api/location_log?jobId=xxxxxxx', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.getlocationLogByJobId);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve(logsJson));

        chai.request(server)
            .get('/api/location_log?jobId=5986b8180a8ea07f61558999')
            //.send(book)
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('locationLogs');
                result.locationLogs[0].should.have.property('companyId').eql('5986b8180a8ea07f6155858d');
                result.locationLogs[0].should.have.property('jobId').eql('5986b8180a8ea07f61558999');
                result.locationLogs[0].should.have.property('dateLog').eql('2017-08-16T03:49:26.304Z');
                result.locationLogs[0].should.have.property('location');
                result.locationLogs[0].location.should.have.property('lat').eql(34.1022);
                result.locationLogs[0].location.should.have.property('lng').eql(-118.2737);

                result.locationLogs[1].should.have.property('companyId').eql('5986b8180a8ea07f6155858d');
                result.locationLogs[1].should.have.property('jobId').eql('5986b8180a8ea07f61558999');
                result.locationLogs[1].should.have.property('dateLog').eql('2017-11-30T03:49:26.304Z');
                result.locationLogs[1].should.have.property('location');
                result.locationLogs[1].location.should.have.property('lat').eql(877.3333);
                result.locationLogs[1].location.should.have.property('lng').eql(-1.7331);
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });

    });

    it('it should (POST) create location log (POST/api/location_log)', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.createLocationLog);
        taskMapperMock.expects('fnc').once().returns(Promise.resolve('{ "dateLog": "2017-11-30T03:49:26.304Z" }'));

        chai.request(server)
            .post('/api/location_log')
            .send({
                "jobId": "5986b8180a8ea07f61558999",
                "location": {
                    "lat": 800.3333,
                    "lng": -1.7331
                }
            })
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('dateLog').eql('2017-11-30T03:49:26.304Z');
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });
});

var logsJson = {
    "locationLogs": [{
            "companyId": "5986b8180a8ea07f6155858d",
            "jobId": "5986b8180a8ea07f61558999",
            "dateLog": "2017-08-16T03:49:26.304Z",
            "location": {
                "lat": 34.1022,
                "lng": -118.2737
            }
        },
        {
            "companyId": "5986b8180a8ea07f6155858d",
            "jobId": "5986b8180a8ea07f61558999",
            "dateLog": "2017-11-30T03:49:26.304Z",
            "location": {
                "lat": 877.3333,
                "lng": -1.7331
            }
        }
    ]
}