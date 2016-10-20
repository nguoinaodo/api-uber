'use strict';

var connection = require(process.cwd() + '/app/db/mysql/connection.js');
var bcrypt = require('bcrypt-nodejs');
var randToken = require('rand-token');
var authToken = require(process.cwd() + '/app/db/lokijs/auth-token');

module.exports = function(req, res) {
    var accountType = req.body.accountType,
        email = req.body.email,
        phone = req.body.phone,
        password = req.body.password;
    
    if (!accountType) {
        res.json({errCode: -1, msg: 'Missing accountType'});
    }
    
    if (accountType !== 'customer' && accountType !== 'driver') {
        res.json({errCode: -4, msg: 'Invalid accountType'});
    }
    
    if ((email && phone) || (!email && !phone)) {
        res.json({errCode: -1, msg: 'Require either email or phone'});
    }
    
    if (!password) {
        res.json({errCode: -1, msg: 'Missing password'});
    }
    
    // 
    connection.query('SELECT * FROM ? WHERE phone LIKE ? OR email LIKE ?;', [accountType, phone, email], function(err, rows) {
        if (err) throw err;
        
        if (!rows[0]) {
            res.json({errCode: -3, msg: 'Account not exists'});
        }
        
        if (!bcrypt.compareSync(password, rows[0].password)) {
            res.json({errCode: -2, msg: 'Invalid password'});
        }
        
        // every thing is ok
        delete rows[0].password;
        var token = randToken.generate(32);
        
        // save token
        if (email) {
            authToken.insert({
                token: token, 
                email: email,
                phone: '',
                accountType: accountType
            });
        } else {
            authToken.insert({
                token: token, 
                email: '',
                phone: phone,
                accountType: accountType
            });
        }
        
        res.json({errCode: 0, msg: 'Logged in successfully', data: {
            token: token,
            user: rows[0]
        }});
    });
};