const LocationLogModel = require('../model/location_log');
const log = require('../lib/log');

const locationLog = {
    getAll: function (option) {
        return new Promise((resolve, reject) => {
            LocationLogModel.find({}, function (err, locLogs) {
                if ((err) || (locLogs.length == 0)) {
                    return reject(err);
                }
                var locMap = {
                    'locationLogs': []
                };
                locLogs.forEach(function (c) {
                    locMap.locationLogs.push(c);
                });

                resolve(locMap);
            });
        });
    },

    getByJobId: function (option) {
        const companyId = option.companyId;
        const jobId = option.jobId;
        validateId_(companyId);
        return new Promise((resolve, reject) => {
            LocationLogModel.find({
                'jobId': jobId,
                'companyId': companyId
            }, function (err, logs) {
                if (err) return reject(err);
                var logList = {
                    'locationLogs': []
                };
                logs.forEach(function (c) {
                    logList.locationLogs.push(c);
                });

                resolve(logList);
            });
        });
    },

    create: function (option) {
        const companyId = option.companyId;
        const data = option.data
        validateId_(companyId);
        return new Promise((resolve, reject) => {
            if (typeof option.data !== 'object') {
                data = JSON.parse(data);
            }

            if (!Array.isArray(data.locationLogs)) {
                reject("Wrong arguments: not an array");
            }

            data.locationLogs.forEach(function (location) {
                const newLog = new LocationLogModel();
                copyCompanyId_(newLog, companyId);
                copy_(location, newLog);

                newLog.save(function (err) {
                    if (err) return reject(err);
                    return resolve({
                        'dateLog': newLog.dateLog
                    });
                });
            });
        });
    },
};

var copyCompanyId_ = function (newLog, id) {
    newLog["companyId"] = id;
}

var validateId_ = function (id) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        throw ("Invalid ID");
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

module.exports = locationLog;