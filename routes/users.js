var express = require('express');
var router = express.Router();
const users = require("../src/controller/users");

/* GET users listing. */
//router.get('/', function(req, res, next) {
//  res.send('respond with a resource');
//});

router.get('/', users.getUsers);

module.exports = router;
