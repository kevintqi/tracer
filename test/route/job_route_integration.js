'use strict';

const job = require('../../app/entity/job');
const JobModel = require('../../app/model/job');

const chai = require('chai');
const assert = require('chai').assert;
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('INTEGRATION TEST for JOB Requests: job_route_integration.js', () => {
    beforeEach((done) => {
        JobModel.remove({}, function (err) {
            if (err) {
                console.log(err)
            } else {
                console.log('Cleared job info');
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

    it('it should (POST) create a job (/api/job)', (done) => {
        chai.request(server)
            .post('/api/job')
            .send(JSON.parse(getJob()))
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('jobId')
                assert(result.jobId.match(/^[0-9a-fA-F]{24}$/));
                done();
            });
    });

    it('it should GET job by id (/api/job/<job_id>', (done) => {
        var options = {
            'companyId': '5986b8180a8ea07f6155858d',
            'jobData': getJob()
        }

        var jobId;
        job.create(options).then(data => {
            const jobObj = data;
            jobId = jobObj.jobId;

            chai.request(server)
                .get('/api/job/' + jobId)
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('job');
                    result.job.should.have.length.above(0);
                    result.job[0].contact.should.have.property('name').eql('Kevin');
                    // TODO: lechDev add the rest of properties
                    done();
                });
        }).catch(err => {
            console.log(err)
        });
    });


    it('it should PUT (Assignment)', (done) => {
        var assigneeId = '2222b8180a8ea07f61551111';
        var options = {
            'companyId': '5986b8180a8ea07f6155858d',
            'jobData': getJob()
        }

        var jobId;
        job.create(options).then(data => {
            const jobObj = data;
            chai.request(server)
                .put('/api/job/' + jobObj.jobId + '/update')
                .send({
                    assignee: assigneeId
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('assignee').eql(assigneeId);

                    chai.request(server)
                        .get('/api/job/' + jobObj.jobId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = res.body;
                            result.should.be.a('object');
                            result.should.have.property('job');
                            result.job.should.have.length.above(0);
                            result.job[0].should.have.property('assignee').eql(assigneeId);
                            done();
                        });
                });
        }).catch(err => {
            console.log(err)
        });
    });


    it('it should PUT (Status)', (done) => {
        var assigneeId = '2222b8180a8ea07f61551111';
        var options = {
            'companyId': '5986b8180a8ea07f6155858d',
            'jobData': getJob()
        }

        var jobId;
        job.create(options).then(data => {
            const jobObj = data
            chai.request(server)
                .put('/api/job/' + jobObj.jobId + '/update')
                .send({
                    'status': 'Done',
                    'statusIcon': 'images/check.png',
                    'actualSchedule': {
                        'startDate': '1503770535555',
                        'endDate': '1503770536666',
                        'time': {
                            'start': '1503770531111',
                            'end': '1503770532222'
                        }
                    }
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    let result = res.body;
                    result.should.be.a('object');
                    result.should.have.property('status').eql('Done');
                    result.should.have.property('statusIcon').eql('images/check.png');
                    result.actualSchedule.should.have.property('startDate');
                    var date = new Date(1503770535555);
                    result.actualSchedule.should.have.property('startDate').eql(date.toISOString());
                    date = new Date(1503770536666);
                    result.actualSchedule.should.have.property('endDate').eql(date.toISOString());
                    date = new Date(1503770531111);
                    result.actualSchedule.time.should.have.property('start').eql(date.toISOString());
                    date = new Date(1503770532222);
                    result.actualSchedule.time.should.have.property('end').eql(date.toISOString());

                    chai.request(server)
                        .get('/api/job/' + jobObj.jobId)
                        .end((err, res) => {
                            res.should.have.status(200);
                            let result = res.body;
                            result.should.be.a('object');
                            result.should.have.property('job');
                            result.job.should.have.length.above(0);
                            result.job[0].should.have.property('status').eql('Done');
                            result.job[0].should.have.property('statusIcon').eql('images/check.png');
                            result.job[0].actualSchedule.should.have.property('startDate');
                            var date = new Date(1503770535555);
                            result.job[0].actualSchedule.should.have.property('startDate').eql(date.toISOString());
                            date = new Date(1503770536666);
                            result.job[0].actualSchedule.should.have.property('endDate').eql(date.toISOString());
                            date = new Date(1503770531111);
                            result.job[0].actualSchedule.time.should.have.property('start').eql(date.toISOString());
                            date = new Date(1503770532222);
                            result.job[0].actualSchedule.time.should.have.property('end').eql(date.toISOString());
                            done();
                        });
                });
        }).catch(err => {
            console.log(err)
        });
    });
});


var getJob = function () {
    return '{' +
        //      '"companyId" : "5986b8180a8ea07f6155858d",' +
        '"contact": {' +
        '"name": "Kevin",' +
        '"phoneNumber": "310 333 5050"' +
        '},' +
        '"location": {' +
        '"lat": 34.0723,' +
        '"lng": -118.2436,' +
        '"address": {' +
        '"street": "17985 Pacific Coast Hwy",' +
        '"city": "Torrance",' +
        '"state": "CA",' +
        '"zipCode": "90272"' +
        '}' +
        '},' +
        '"assignee": "5986b8180a8ea07f6155858d",' +
        '"status": "Blocked",' +
        '"statusIcon": "images/block.png",' +
        '"targetTime": {' +
        '"label": "Schedule",' +
        '"start": "1503770530839" ,' +
        '"end": "1503770530840"' +
        '},' +
        '"actualSchedule": {' +
        '"startDate": "1503770530845",' +
        '"endDate": "1503770530999",' +
        '"time": {' +
        '"start": "1503770530845",' +
        '"end": "1503770530846"' +
        '}' +
        '},' +
        '"mileage": 3333,' +
        '"archived": 1503770530839' +
        '}';

}
//https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai