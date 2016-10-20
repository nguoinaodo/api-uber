'use strict';

var LocalStrategy = require('passport-local').Strategy;
var pool = require(process.cwd() + '/app/db/mysql/pool');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(passport) {
    // login 
	passport.use('login', new LocalStrategy({
		usernameField: 'email',
		passReqToCallback: true
	}, function(req, email, password, done) {
		pool.getConnection(function(err, conn) {
			if (err) throw err;
			
			conn.query('select * from ? where email = ? or phone = ?;', [req.body.accountType, req.body.email, req.body.phone],
				function(err, rows) {
				
					if (err) return done(err);
					
					// no user found
					if (!rows.length) {
						conn.release();
						return done(null, false, {msg: 'no user found'});
					}
					// wrong password
					if (!bcrypt.compareSync(password, rows[0].password)) {
						conn.release();
						return done(null, false, {msg: 'wrong password'});
					}
					// all is well
					conn.release();
					delete rows[0].password;
					return done(null, rows[0]);
			});
		});
	}));

}