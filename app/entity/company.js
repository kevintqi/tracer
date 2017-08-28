const CompanyModel = require('../model/company');
const log = require('../lib/log');


const company = {

    getByCustomerId: function (option) {
        const customerId = option;
        return new Promise((resolve, reject) => {
            CompanyModel.findOne({
                    'customerId': customerId
                })
                .populate('customerId')
                .exec(function (err, company) {
                    if (err) return reject(err);
                    resolve(JSON.stringify(company));
                });
        });
    },

    // refactor-x
    getById: function (option) {
        const id = option;
        return new Promise((resolve, reject) => {
            CompanyModel.findOne({
                    '_id': id
                })
                .populate('customerId')
                .exec(function (err, company) {
                    if (err) return reject(err);
                    resolve(JSON.stringify(company));
                });
        });
    },


    getAll: function (option) {
        return new Promise((resolve, reject) => {
            CompanyModel.find({}, function (err, companies) {
                if (err) return reject(err);
                var coMap = {
                    'companies': []
                };
                companies.forEach(function (c) {
                    coMap.companies.push(c);
                });

                resolve(JSON.stringify(coMap));
            });
        });
    },

    create: function (option) {
        const newCoData = option;
        return new Promise((resolve, reject) => {
            let data;
            if (typeof newCoData === 'object') {
                data = newCoData;
            } else {
                data = JSON.parse(newCoData);
            }
            const newCompany = new CompanyModel();
            copy_(data, newCompany);

            newCompany.save(function (err) {
                if (err) return reject(err);
                return resolve('{ "companyId": "' + newCompany._id + '"}');
            });
        });
    },

    update: function (option) {
        const companyId = option.companyId;
        const coData = option.coData;
        return new Promise((resolve, reject) => {
            CompanyModel.findOne({
                '_id': companyId
            }, function (err, co) {
                if ((err) || (co === null)) return reject(err);


                copy_(coData, co);

                co.save(function (err) {
                    if (err) return reject(err);
                    //return resolve('{ "companyId": "' + co._id + '"}');
                    return resolve(JSON.stringify(co));
                });
            });
        });
    },

    patchLanguage: function (option) {
        const companyId = option.companyId;
        const coData = option.coData;
        return new Promise((resolve, reject) => {
            CompanyModel.findOne({
                '_id': companyId
            }, function (err, co) {
                if ((err) || (co === null)) return reject(err);

                co.appSettings.preferredLanguage = coData.preferredLanguage;

                co.save(function (err) {
                    if (err) return reject(err);
                    return resolve('{ "language": "' + co.appSettings.preferredLanguage + '"}');
                });
            });
        });
    }
};

var copy_ = function (oriCo, newCo) {
    for (var attributename in newCo) {
        if (oriCo.company.hasOwnProperty(attributename)) {
            newCo[attributename] = oriCo.company[attributename];
        }
    }
    //newCo.updated = Date.now;
}

module.exports = company;