"use strict"

const log = require('../lib/log')
const UserDao = require('../dao/userdao');

exports.getUsers = function (req, res) {
    const dao = new UserDao();
    /*    const jData = {
            'userId': '1357',
            'data': '[{"Raul Ramirez", "Juan Meyers", "Ruben Lechner"}]'
        };
    dao.save(jData);
    */

    dao.getAll().then(users => {
        log.info(users);
        res.send(users);
    }).catch(err => {
        err.code = 500;
        err.codeStr = "Interal Error";
        res.send(err);
    });
}