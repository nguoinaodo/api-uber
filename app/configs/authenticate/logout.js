'use strict';

var authToken = require(process.cwd() + '/app/db/lokijs/auth-token');

module.exports = function(req, res) {
    authToken.remove({token: req.cookies.token});
    res.redirect('/auth/login');
};