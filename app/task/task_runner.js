"use strict";

const Task = require('../task/task');

exports.go = function (req, res, type, option) {
   
    if (!req.isAuthenticated()) {
        return res.send(401, 'Unauthorized');
    }

    const task = new Task(type, option);
    if (!task.isValid()) {
        res.writeHead(400, "Bad Request");
        return res.end();
    }

    const handler = task.handler();
    if (handler === null) {
        res.writeHead(501, "Not Implemented");
        return res.end();
    }

    handler.run()
        .then(status => {
            res.json(status);
        })
        .catch(err => {
            res.writeHead(500, "Internal Server Error");
            res.end(err.toString());
        });
}