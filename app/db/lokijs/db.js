var loki = require('lokijs');

// database
var db = new loki('uber.json');

module.exports = db;