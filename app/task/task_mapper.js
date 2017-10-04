"use strict";

const company = require('../entity/company');
const job = require('../entity/job');

// taskMapper
const taskMapper = {
    'getCompanies': {
        'fnc': company.getAll,
        'name': 'getCompanies'
    },
    'getCompany': {
        'fnc': company.get,
        'name': 'getCompany'
    },
    'getCompanyById': {
        'fnc': company.getById,
        'name': 'getCompanyById'
    },
    'createCompany': {
        'fnc': company.create,
        'name': 'createCompany'
    },
    'updateCompany': {
        'fnc': company.update,
        'name': 'updateCompany'
    },
    //////
    // JOB Section
    //////
    'getJobs': {
        'fnc': job.getJobs,
        'name': 'getJobs'
    },
    'createJob': {
        'fnc': job.create,
        'name': 'createJob'
    },
    'getJob': {
        'fnc': job.getJob,
        'name': 'getJob'
    },
    'updateJob': {
        'fnc': job.update,
        'name': 'updateJob'
    }
};

module.exports = taskMapper;