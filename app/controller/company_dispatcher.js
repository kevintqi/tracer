"use strict";

const taskMapper = require('../task/task_mapper');
const runner = require('../task/task_runner');


const dispatcher = {

    getCompanies: function (req, res) {
        runner.go(req, res, taskMapper.getCompanies.name, "none");
    },
    getCompany: function (req, res) {
        runner.go(req, res, taskMapper.getCompany.name,
            req.user.local.companyId);
    },
    getCompanyById: function (req, res) {
        runner.go(req, res, taskMapper.getCompanyById.name,
            req.params.company_id);
    },
    createCompany: function (req, res) {
        runner.go(req, res, taskMapper.createCompany.name, req.body);
    },
    updateCompany: function (req, res) {
        var options = {
            'companyId': req.user.local.companyId,
            'coData': req.body
        }
        runner.go(req, res, taskMapper.updateCompany.name, options);
    },
};

module.exports = dispatcher;