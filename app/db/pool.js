var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit: 50,
    host: '05b86dc0-e75c-45b3-a921-a69900404027.mysql.sequelizer.com',
    user: 'wzuzuqjhguwkissr',
    password: 'VAjnsQhi6EDVEae6W7sriXffGrc7ynw4GAzPBWUkWP8qhHTpS5JuzzE7vdNbMiRS',
    database: 'db05b86dc0e75c45b3a921a69900404027'
});

//mysql://wzuzuqjhguwkissr:VAjnsQhi6EDVEae6W7sriXffGrc7ynw4GAzPBWUkWP8qhHTpS5JuzzE7vdNbMiRS@05b86dc0-e75c-45b3-a921-a69900404027.mysql.sequelizer.com/db05b86dc0e75c45b3a921a69900404027
module.exports = pool;