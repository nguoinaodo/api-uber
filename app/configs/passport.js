'use strict';

var LocalStrategy = require('passport-local').Strategy;
var pool = require('../db/pool');
var bcrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
    //
	passport.serializeUser(function (user, done) {
		console.log('serializeUser');
		
		var type = user.cusId? 'customer': 'driver';
		var key = {
		    type: type,
		    id: type === 'customer'? user.cusId: user.driverId
		};
		
		done(null, key);
	});
	//
	passport.deserializeUser(function (key, done) {
		pool.getConnection(function(err, conn) {
			if (err) throw err;
			
			console.log('deserializeUser');
			
			var query;
			
			if (key.type === 'customer') {
			    query = 'select * from customer where cusId = "' + key.id + '"';
			} else {
			    query = 'select * from driver where driverId = "' + key.id + '"';
			}
			
			conn.query(query, function(err, rows) {
				conn.release();
				done(err, rows[0]);
			});
		});
	});
	// sign up customer
	passport.use('local-signup-customer', new LocalStrategy({
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, account, password, done) {
		process.nextTick(function() {
			pool.getConnection(function(err, conn) {
				if (err) throw err;
				
				console.log('connect as id ' + conn.threadId);
				conn.query('select * from customer where account ="' + account + '"', function(err, rows) {
					if (err) return done(err);
					
					// email exists
					if (rows.length) { 
						console.log('account exists');
						return done(null, false, {message: 'account exists'});
					}
					// else create new user
					var newUser = {};
					
					newUser.account = account;
					newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
					conn.query("insert into customer (account, password) value ('" + account + "', '" + newUser.password + "')", 
						function(err, result) {
							if (err) throw err;
							
							conn.release();
							newUser.cusId = result.insertId;
							delete newUser.password;
							return done(null, newUser);
						});
				});
			});
		});
		
	}));
	
	// login customer
	passport.use('local-login-customer', new LocalStrategy({
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, account, password, done) {
		pool.getConnection(function(err, conn) {
			if (err) throw err;
			
			console.log('login');
			conn.query('select * from customer where account = "' + account + '"', function(err, rows) {
				if (err) return done(err);
				
				// no user found
				if (!rows.length) {
					console.log('no user found');
					
					conn.release();
					return done(null, false, {message: 'no user found'});
				}
				// wrong password
				if (!bcrypt.compareSync(password, rows[0].password)) {
					console.log('wrong pass');
					
					conn.release();
					return done(null, false, {message: 'wrong password'});
				}
				// all is well
				conn.release();
				delete rows[0].password;
				return done(null, rows[0]);
			});
		});
	}));
	// sign up driver
	passport.use('local-signup-driver', new LocalStrategy({
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, account, password, done) {
		process.nextTick(function() {
			pool.getConnection(function(err, conn) {
				if (err) throw err;
				
				console.log('connect as id ' + conn.threadId);
				conn.query('select * from driver where account ="' + account + '"', function(err, rows) {
					if (err) return done(err);
					
					// email exists
					if (rows.length) { 
						console.log('acount exists');
						return done(null, false, {message: 'account exists'});
					}
					// else create new user
					var newUser = {};
					
					newUser.account = account;
					newUser.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
					conn.query("insert into driver (account, password) value ('" + account + "', '" + newUser.password + "')", 
						function(err, result) {
							if (err) throw err;
							
							console.log('save');
							conn.release();
							newUser.driverId = result.insertId;
							delete newUser.password;
							return done(null, newUser);
						});
				});
			});
		});
		
	}));
	
	// login customer
	passport.use('local-login-driver', new LocalStrategy({
		usernameField: 'account',
		passwordField: 'password',
		passReqToCallback: true
	}, function(req, account, password, done) {
		pool.getConnection(function(err, conn) {
			if (err) throw err;
			
			conn.query('select * from driver where account = "' + account + '"', function(err, rows) {
				if (err) return done(err);
				
				// no user found
				if (!rows.length) {
					console.log('no user found');
					conn.release();
					return done(null, false, {message: 'no user found'});
				}
				// wrong password
				if (!bcrypt.compareSync(password, rows[0].password)) {
					console.log('wrong pass');
					conn.release();
					return done(null, false, {message: 'wrong password'});
				}
				// all is well
				conn.release();
				delete rows[0].password;
				return done(null, rows[0]);
			});
		});
	}));
};
