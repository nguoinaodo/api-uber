'use strict';

var pool = require(process.cwd() + '/app/db/mysql/pool.js');
var signup = require('./signup.js');
var login = require('./login.js');

module.exports = function (passport) {
    // serialize user
	passport.serializeUser(function (user, done) {
		if (user.cusId) {
			done(null, {customerId: user.cusId});
		} else {
			done(null, {driverId: user.driverId});
		}
	});
	// deserialize user
	passport.deserializeUser(function (userId, done) {
		pool.getConnection(function(err, conn) {
			if (err) throw err;
			
			var query;
			
			if (userId.cusId) {
			    query = 'select * from customer where cusId = "' + userId.cusId + '"';
			} else {
			    query = 'select * from driver where driverId = "' + userId.driverId + '"';
			}
			
			conn.query(query, function(err, rows) {
				conn.release();
				done(err, rows[0]);
			});
		});
	});
	
	signup(passport);
	login(passport);
		
};
