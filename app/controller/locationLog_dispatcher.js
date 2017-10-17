const taskMapper = require('../task/task_mapper');
const runner = require('../task/task_runner');


const locationLogDispatcher = {
    getLogs: function(req, res) {
       runner.go(req, res, taskMapper.getLocationLogs.name, "none");
    },
    getByJobId: function(req, res) {
        var options = {
            'companyId': req.user.local.companyId,
            'jobId': req.query.jobId
        }
       runner.go(req, res, taskMapper.getlocationLogByJobId.name, options);
    },
    create: function(req, res) {
        var options = {
            'companyId': req.user.local.companyId,
            'data': req.body
        }
       runner.go(req, res, taskMapper.createLocationLog.name, options);
    }
};

module.exports = locationLogDispatcher;