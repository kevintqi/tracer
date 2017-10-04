"use strict";

const JobModel = require('../model/job');
const log = require('../lib/log');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const job = {

    create: function (option) {
        const companyId = option.companyId;
        const jobData = option.jobData
        validateId_(companyId);
        return new Promise((resolve, reject) => {
            let data;
            if (typeof jobData === 'object') {
                data = jobData;
            } else {
                data = JSON.parse(jobData);
            }

            const newJob = new JobModel();
            copyCompanyId_(newJob, companyId);
            copy_(data, newJob);

            newJob.save(function (err) {
                if (err) return reject(err);
                return resolve({ 'jobId':  newJob._id });
            });
        });
    },

    getJobs: function (option) {
        const companyId = option;
        validateId_(companyId);
        return new Promise((resolve, reject) => {
            JobModel.find({
                'companyId': companyId
            }, function (err, jobs) {
                if (err) return reject(err);
                var jobList = {
                    'jobs': []
                };
                jobs.forEach(function (c) {
                    jobList.jobs.push(c);
                });

                resolve(jobList);
            });
        });
    },

    getJob: function (option) {
        const companyId = option.companyId;
        const jobId = option.jobId;
        validateId_(companyId);
        return new Promise((resolve, reject) => {
            JobModel.find({
                '_id': jobId,
                'companyId': companyId
            }, function (err, jobs) {
                if (err) return reject(err);
                var jobList = {
                    'job': []
                };
                jobs.forEach(function (c) {
                    jobList.job.push(c);
                });

                resolve(jobList);
            });
        });
    },

    update: function (option) {
        const jobId = option.jobId;
        const jobData = option.jobData;
        validateId_(jobId);
        return new Promise((resolve, reject) => {
            JobModel.findOne({
                '_id': jobId
            }, function (err, job) {
                if ((err) || (job === null)) return reject(err);

                copy_(jobData, job);

                job.save(function (err) {
                    if (err) return reject(err);
                    return resolve(job);
                });
            });
        });
    }
};

var copyCompanyId_ = function (newJob, id) {
    newJob["companyId"] = id;
}

var validateId_ = function (id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw ("Invalid ID - JOB TASK");
    }
}

var copy_ = function (oriJob, newJob) {
    for (var attributename in oriJob) {
        if (oriJob.hasOwnProperty(attributename)) {
            newJob[attributename] = oriJob[attributename];
        }
    }
    //newCo.updated = Date.now;
}

module.exports = job;