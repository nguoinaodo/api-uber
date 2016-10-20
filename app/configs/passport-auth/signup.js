'use strict';

var LocalStrategy = require('passport-local').Strategy;
var pool = require(process.cwd() + '/app/db/mysql/pool');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    passport.use('signup', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, function(req, email, password, done) {
		process.nextTick(function() {
			pool.getConnection(function(err, conn) {
				if (err) throw err;
				
				console.log('connect as id ' + conn.threadId);
				if (req.accountType === 'customer') {
					// signup customer
					conn.query('select * from customer where email = ? or phone = ?;',
						[req.body.email, req.body.phone], function(err, rows) {
						
						if (err) return done(err);
						
						// email exists
						if (rows.length) { 
							return done(null, false, {msg: 'email or phone exists'});
						}
						// else create new user
						var newUser = {};
						
						newUser.email = req.body.email;
						newUser.phone = req.body.phone;
						newUser.name = req.body.name;
						newUser.lastName = req.body.lastname;
						newUser.address = req.body.address;
						newUser.officeName = req.body.officeName;
						newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
						conn.query('insert into customer set ?', [newUser], 
							function(err, result) {
								if (err) throw err;
								
								conn.release();
								newUser.cusId = result.insertId;
								delete newUser.password;
								return done(null, newUser);
							});
					});
					
				} else {
					// signup driver
					conn.query('select * from driver where email = ? or phone = ?;',
						[req.body.email, req.body.phone], function(err, rows) {
						
						if (err) return done(err);
						
						// email exists
						if (rows.length) { 
							return done(null, false, {msg: 'email or phone exists'});
						}
						// else create new user
						var newUser = {};
						
						newUser.email = req.body.email;
						newUser.phone = req.body.phone;
						newUser.name = req.body.name;
						newUser.lastName = req.body.lastname;
						newUser.license = req.body.license;
						newUser.registration = req.body.registration;
						newUser.insurance = req.body.insurance;
						newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
						conn.query('insert into driver set ?', [newUser], 
							function(err, result) {
								if (err) throw err;
								
								conn.release();
								newUser.driverId = result.insertId;
								delete newUser.password;
								return done(null, newUser);
							});
					});
				}
				
			});
		});
		
	}));
}