var userController = require(process.cwd() + '/app/controllers/userController.js');
var sessionLogin = require(process.cwd() + '/app/configs/authenticate/sessionLogin.js');

module.exports = function(app, passport) {
    ////
    app.route('/')
        .get(function(req, res, next) {
            /*
            if (req.cookies.token) {
                // if there is a token in cookie
                sessionLogin(req, res);
            } else {
                res.redirect('/login');
            }
            
            next();
            */
            
            res.send('hi');
        });
        
    //// api
    
    ////
    
    //// io
    app.route('/io-customer')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/io-customer.html'); 
        });
    
    app.route('/io-driver')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/io-driver.html'); 
        });
    ////
    
    //// authentication
    
    // login
    app.route('/auth/login')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/login.html');
        })
        .post(userController.login);
    // customer signup
    app.route('/auth/signupCustomer')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/signup-customer.html');
        })
        .post(userController.signup);
    
    // driver signup
    app.route('/auth/signupDriver')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/signup-driver.html');
        })
        .post(userController.signup);
        
    // logout
    app.route('/auth/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
    
};