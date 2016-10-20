'use strict';

var connection = require(process.cwd() + '/app/db/mysql/connection');
var bcrypt = require('bcrypt-nodejs');
var authToken = require(process.cwd() + '/app/db/lokijs/auth-token');
var randToken = require('rand-token');

module.exports = function(req, res) {
    
    if (!req.body.accountType) {
		return res.json({errCode: -1, msg: 'Missing accountType'});
	}
	if (req.body.accountType !== "customer" && req.body.accountType !== "driver") {
		return res.json({errCode: -4, msg: 'Invalid accountType, "customer" or "driver" only'});
	}
	if (!req.body.password) {
		return res.json({errCode: -1, msg: 'Missing password'});
	}
	if (!req.body.name) {
		return res.json({errCode: -1, msg: 'Missing name'});
	}
	if (!req.body.lastName) {
		return res.json({errCode: -1, msg: 'Missing lastName'});
	}
	if (!req.body.email) {
		return res.json({errCode: -1, msg: 'Missing email'});
	}
	else {
		var reg = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
		
		if (!reg.test(req.body.email)) {
			return res.json({errCode: -3, msg: 'Email not valid'});
		}
	}
	if (!req.body.phone) {
		return res.json({errCode: -1, msg: 'Missing phone'});
	}

	if (req.body.accountType === "driver") {
		if (!req.body.license) {
			return res.json({errCode: -1, msg: 'Missing license'});
		}
		if (!req.body.insurance) {
			return res.json({errCode: -1, msg: 'Missing insurance'});
		}
		if (!req.body.registration) {
			return res.json({errCode: -1, msg: 'Missing registration'});
		}
	} else {
		if (!req.body.officeName) {
			return res.json({errCode: -1, msg: 'Missing officeName'});
		}
	}  
	//
	var email = req.body.email,
	    phone = req.body.phone,
	    accountType = req.body.accountType,
	    password = req.body.password;
	    
	process.nextTick(function() {
	    connection.query('SELECT * FROM ? WHERE email = ? OR phone = ?;', [accountType, email, phone], function(err, rows) {
	        if (err) throw err;
	        
	        if (rows[0]) {
	            res.json({errCode: -2, msg: 'Email or phone already exists'});
	        }
	        
	        var newUser = {
	            name: req.body.name,
	            lastName: req.body.lastName,
	            email: email,
	            phone: phone,
	            password: bcrypt.hashSync(password)
	        };
	        
	        if (accountType === 'driver') {
	            newUser.license = req.body.license;
	            newUser.registration = req.body.registration;
	            newUser.insurance = req.body.insurance;
	        } else {
	            newUser.officeName = req.body.officeName;
	        }
	        
	        connection.query('INSERT INTO ? SET ?;', [accountType, newUser], function(err, result) {
	            if (err) throw err;
	            
	            delete newUser.password;
                var token = randToken.generate(32);
                
                // save token
                authToken.insert({email: email, phone: phone, token: token, accountType: accountType});
	            
	            newUser[accountType + 'Id'] = result.insertId;
	            res.json({errCode: 0, msg: 'Successfully signup', data: {
	                user: newUser,
	                token: token
	            }});
	        });
 	    });
	});
	
};