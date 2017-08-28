const taskMapper = require('../task/task_mapper');
const runner = require('../task/task_runner');


const jobDispatcher = {
    create: function (req, res) {
        var options = {
            'companyId': req.query.company_id,
            'jobData': req.body
        }
        runner.go(req, res, taskMapper.createJob.name, options);
    },
    getJobByCompanyId: function (req, res) {
        runner.go(req, res, taskMapper.getJobByCompanyId.name,
            req.query.company_id);
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