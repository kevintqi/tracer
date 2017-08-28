"use strict";

const company = require('../entity/company');
const job = require('../entity/job');

// taskMapper
const taskMapper = {
    'getCompanies': {
        'fnc': company.getAll,
        'name': 'getCompanies'
    },
    'getCompanyByCustomerId': {
        'fnc': company.getByCustomerId,
        'name': 'getCompanyByCustomerId'
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
    'updateLanguage': {
        'fnc': company.patchLanguage,
        'name': 'updateLanguage'
    },
    //////
    // JOB Section
    //////
    'createJob': {
        'fnc': job.create,
        'name': 'createJob'
    },
    'getJobByCompanyId': {
        'fnc': job.getByCompanyId,
        'name': 'getJobByCompanyId'
    },
    'updateJob': {
        'fnc': job.update,
        'name': 'updateJob'
    }
};

module.exports = taskMapper;