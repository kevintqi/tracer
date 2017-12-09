'use strict';

const job = require('../../app/entity/job');
const taskMapper = require('../../app/task/task_mapper');

const assert = require('chai').assert
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../bin/www');
const sinon = require('sinon');
const should = chai.should();
const User = require('../../app/model/user');

chai.use(chaiHttp);

describe('UNIT TEST for JOB Requests: job_route_unit.js', () => {
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


    it('it should GET all the jobs (/api/jobs)', (done) => {

        var retJobs = {
            'jobs': []
        };

        retJobs.jobs.push(getJob());
        const taskMapperMock = sinon.mock(taskMapper.getJobs);
        taskMapperMock.expects('fnc').once().returns(
            Promise.resolve(retJobs));

        chai.request(server)
            .get('/api/jobs')
            .end((err, res) => {
                res.should.have.status(200);
                let result = res.body;
                result.should.be.a('object');
                result.should.have.property('jobs');
                result.jobs.should.have.length.above(0);
                let jobOne = JSON.parse(result.jobs[0]);
                jobOne.contact.should.have.property('name').eql('Kevin');
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    it('it should GET job by id(/api/job/<job_id>', (done) => {
        var retJobs = {
            'jobs': []
        };
        retJobs.jobs.push(getJob());
        const taskMapperMock = sinon.mock(taskMapper.getJob);
        taskMapperMock.expects('fnc').once().returns(
            Promise.resolve(JSON.stringify(retJobs)));

        chai.request(server)
            .get('/api/job/5986b8180a8ea07f6155858d')
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('jobs');
                result.jobs.should.have.length.above(0);
                let jobOne = JSON.parse(result.jobs[0]);
                jobOne.contact.should.have.property('name').eql('Kevin');
                // TODO: lechDev add the rest of properties
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    it('it should (POST) create a job (/api/job', (done) => {
        const taskMapperMock = sinon.mock(taskMapper.createJob);
        taskMapperMock.expects('fnc').once().returns(
            Promise.resolve('{ "jobId": "5986b8180a8ea07f6155858d"}'));
        chai.request(server)
            .post('/api/job')
            /*.query({
                company_id: '123'
            })*/
            .send(getJob())
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('jobId')
                assert(result.jobId.match(/^[0-9a-fA-F]{24}$/));
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });

    var assigneeId = '2222b8180a8ea07f61551111';
    it('it should (PUT) update job based on job id (/job/<job_id>/update)', (done) => {
        const retJson = JSON.parse(getJob());
        retJson.assignee = assigneeId;
        const taskMapperMock = sinon.mock(taskMapper.updateJob);
        taskMapperMock.expects('fnc').once().returns(
            Promise.resolve(JSON.stringify(retJson)));
        chai.request(server)
            .put('/api/job/123/update')
            .send({
                assignee: assigneeId
            })
            .end((err, res) => {
                res.should.have.status(200);
                let result = JSON.parse(res.body);
                result.should.be.a('object');
                result.should.have.property('assignee').eql(assigneeId);
                taskMapperMock.verify();
                taskMapperMock.restore();
                done();
            });
    });
});

var getJob = function () {
    return '{' +
        '"companyId" : "5986b8180a8ea07f6155858d",' +
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
        '"assignee": 456,' +
        '"status": "Blocked",' +
        '"statusIcon": "images/block.png",' +
        '"targetTime": {' +
        '"label": "Schedule",' +
        '"start": "1503770530839" ,' +
        '"end": "1503770530840"' +
        '},' +
        '"actualTime": {' +
        '"label": "Actual",' +
        '"start": "1503770530845"' +
        '},' +
        '"mileage": 3333,' +
        '"archived": 1503770530839' +
        '}';

}