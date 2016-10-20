var db = require('./db.js');

// collection auth token
var authToken = db.addCollection('auth-token');

module.exports = authToken;