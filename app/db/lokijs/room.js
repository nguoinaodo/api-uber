var db = require('./db.js');
var room = db.addCollection('room');

module.exports = room;