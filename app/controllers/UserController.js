var pool = require('../db/pool.js');
var passport = require('passport');

module.exports = {
    getCustomerInfo: function(req, res) {
        var auth = req.isAuthenticated();
        
        if (auth) {
            var cusId = req.params.cusId;
            
            pool.getConnection(function(err, conn) {
                if (err) throw err;
                
                conn.query('select * from customer where cusId = "' + cusId + '"', function(err, rows) {
                    if (err) throw err;
                    
                    conn.release();
                    res.json(rows[0]);
                });
            });
        } else {
            res.redirect('/login-customer');
        }
    },
    
    getDriverInfo: function(req, res) {
        var auth = req.isAuthenticated();
        
        if (auth) {
            var driverId = req.params.driverId;
            
            pool.getConnection(function(err, conn) {
                if (err) throw err;
                
                conn.query('select * from driver where driverId = "' + driverId + '"', function(err, rows) {
                    if (err) throw err;
                    
                    conn.release();
                    res.json(rows[0]);
                });
            });
        } else {
            res.redirect('/login-driver');
        }
    },
    /////////
    driverLogin: function(req, res) {
        passport.authenticate('local-login-driver', function(err, user, info) {
                if (err) throw err;
                
                if (!user) 
                    return res.json({success: 0, msg: info.message});
                    
                req.logIn(user, function(err) {
                    if (err) throw err;
                    
                    return res.json({success: 1, result: user});
                });
                
            }) (req, res);
    },
    
    driverSignup: function(req, res)  {
        passport.authenticate('local-signup-driver', function(err, user, info) {
            if (err) throw err;
            
            if (!user) 
                return res.json({success: 0, msg: info.message});
                    
            req.logIn(user, function(err) {
                if (err) throw err;
                
                return res.json({success: 1, result: user});
            });
            
        }) (req, res);
    },
    
    customerLogin: function(req, res) {
        passport.authenticate('local-login-customer', function(err, user, info) {
                if (err) throw err;
                
                if (!user) 
                    return res.json({success: 0, msg: info.message});
                    
                req.logIn(user, function(err) {
                    if (err) throw err;
                    
                    return res.json({success: 1, result: user});
                });
                
            }) (req, res);
    },
    
    customerSignup: function(req, res) {
        passport.authenticate('local-signup-customer', function(err, user, info) {
                if (err) throw err;
                
                if (!user) 
                    return res.json({success: 0, msg: info.message});
                    
                req.logIn(user, function(err) {
                    if (err) throw err;
                    
                    return res.json({success: 1, result: user});
                });
                
            }) (req, res);
    }
};