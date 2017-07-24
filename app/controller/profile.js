"use strict"

var User = require('../model/user');

exports.setLang = function (req, res) {

    let id = req.param('id');
    let lang = req.param('lang');

    User.findById(id, function (err, user) {
        // if there are any errors, return the error
        if (err) {
            res.writeHeader(500, "Internal Error");
            return res.end(err.toString());
        }

        // check to see if theres already a user with that email
        if (user) {
            user.update({
                    $set: {
                        'local.lang': lang
                    }
                }, {
                    multi: true
                },
                function (err, updated) {
                    if (err)
                        throw err;
                    res.writeHeader(200, "OK");
                    return res.end();
                });

        } else {
            res.writeHeader(404, "Not Found");
            return res.end(err);
        }
    });

}