const taskMapper = require('../task/task_mapper');
const runner = require('../task/task_runner');


const jobDispatcher = {
    getJobs: function (req, res) {
        runner.go(req, res, taskMapper.getJobs.name,
            req.user.local.companyId);
    },
    create: function (req, res) {
        var options = {
            'companyId': req.user.local.companyId,
            'jobData': req.body
        }
        runner.go(req, res, taskMapper.createJob.name, options);
    },
    getJob: function (req, res) {
        var options = {
            'companyId': req.user.local.companyId,
            'jobId': req.params.job_id
        }
        runner.go(req, res, taskMapper.getJob.name, options);
    },
    updateJob: function(req, res) {
        var options = {
            'jobId': req.params.job_id,
            'jobData': req.body
        }
        runner.go(req, res, taskMapper.updateJob.name, options);
    }
};

module.exports = jobDispatcher;