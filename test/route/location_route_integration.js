'use strict';

const locationLog = require('../../app/entity/location_log');
const LocationLogModel = require('../../app/model/location_log');

const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('INTEGRATION TEST for JOB Requests: location_route_integration.js', () => {
    beforeEach((done) => {
        LocationLogModel.remove({}, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Cleared location log info');
            }
        });

        sinon.stub(server.request, 'isAuthenticated').callsFake(function (req, res, next) {
            return true;
        });

        var user = new User();
        user.local.lang = 'en-us';
        user.local.role = 'manager';
        user.local.group = 'acc_1_out_for_service';
        user.local.companyId = '5986b8180a8ea07f6155858d';
        server.request.user = user;

        done();
    });

    afterEach(function () {
        server.request.isAuthenticated.restore();
    });

    it('it should GET all the location logs (/api/location_logs)', (done) => {
        var options = {
            'companyId': '5986b8180a8ea07f6155858d',
            'data': logJson
        }
        locationLog.create(options).then(data => {}).catch(err => {
            console.log(err)
        });

        chai.request(server)
            .get('/api/location_logs')
            .end((err, res) => {
                let result = res.body;
                res.should.have.status(200);
                result.should.be.a('object');
                result.should.have.property('locationLogs');
                result.locationLogs[0].should.have.property('companyId').eql('5986b8180a8ea07f6155858d');
                result.locationLogs[0].should.have.property('jobId').eql('5986b8180a8ea07f61558999');
                result.locationLogs[0].should.have.property('dateLog').to.not.have.lengthOf(0);;
                result.locationLogs[0].should.have.property('location');
                result.locationLogs[0].location.should.have.property('lat').eql(34.1022);
                result.locationLogs[0].location.should.have.property('lng').eql(-118.2737);
                done();
            });
    });

    it('it should (POST) create a location log (/api/location_log)', (done) => {
        chai.request(server)
            .post('/api/location_log')
            .send(logJson)
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.have.property('dateLog').to.not.have.lengthOf(0);;
                done();
            });
    });

    it('it should GET location log by job id (/api/location_log)', (done) => {
        var options = {
            'companyId': '5986b8180a8ea07f6155858d',
            'data': logJson
        }
        locationLog.create(options).then(data => {
            chai.request(server)
                .get('/api/location_log?jobId=5986b8180a8ea07f61558999')
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('locationLogs');
                    result.locationLogs[0].should.have.property('companyId').eql('5986b8180a8ea07f6155858d');
                    result.locationLogs[0].should.have.property('jobId').eql('5986b8180a8ea07f61558999');
                    result.locationLogs[0].should.have.property('dateLog').to.not.have.lengthOf(0);;
                    result.locationLogs[0].should.have.property('location');
                    result.locationLogs[0].location.should.have.property('lat').eql(34.1022);
                    result.locationLogs[0].location.should.have.property('lng').eql(-118.2737);
                    done();
                });
        }).catch(err => {
            console.log(err)
        });
    });
});

var logJson = {
    "locationLogs": [{
        "jobId": "5986b8180a8ea07f61558999",
        "location": {
            "lat": 34.1022,
            "lng": -118.2737
        },
        "dateLog": 1510443461995
    }]
}

//https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai