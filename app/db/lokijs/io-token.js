var db = require('./db.js');

// collection socket token
var token = db.addCollection('token');

module.exports = token;