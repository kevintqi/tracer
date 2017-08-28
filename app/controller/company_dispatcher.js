"use strict";

const taskMapper = require('../task/task_mapper');
const runner = require('../task/task_runner');


const dispatcher = {

    getCompanies: function (req, res) {
        runner.go(req, res, taskMapper.getCompanies.name, "none");
    },
    getCompanyByCustomerId: function (req, res) {
        runner.go(req, res, taskMapper.getCompanyByCustomerId.name,
            req.query.customer_id);
    },
    // refactor-x
    getCompanyById: function (req, res) {
        runner.go(req, res, taskMapper.getCompanyById.name,
            req.params.company_id);
    },
    createCompany: function (req, res) {
        runner.go(req, res, taskMapper.createCompany.name, req.body);
    },
    updateCompany: function (req, res) {
        var options = {
            'companyId': req.query.company_id,
            'coData': req.body
        }
        runner.go(req, res, taskMapper.updateCompany.name, options);
    },
    updateLanguage: function (req, res) {
        var options = {
            'companyId': req.params.company_id,
            'coData': req.body
        }
        runner.go(req, res, taskMapper.updateLanguage.name, options);
    }
};

module.exports = dispatcher;