var pool = require(process.cwd() + '/app/db/pool.js');
var UserController = require(process.cwd() + '/app/controllers/UserController.js');

module.exports = function(app, passport) {
    
    app.route('/')
        .get(function(req, res) {
            if (req.isAuthenticated()) {
                res.send('logged in successfully');
            } else {
                res.send('please login or sign up');
            }
        });
    // auth
    // customer login
    app.route('/login-customer')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/login-customer.html');
        })
        .post(UserController.customerLogin);
    // customer sign up
    app.route('/signup-customer')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/signup-customer.html');
        })
        .post(UserController.customerSignup);
    // driver login
    app.route('/login-driver')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/login-driver.html');
        })
        .post(UserController.driverLogin);
    // driver sign up
    app.route('/signup-driver')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/signup-driver.html');
        })
        .post(UserController.driverSignup);
        
    // logout
    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            res.redirect('/');
        });
    // api
    app.route('/api/getCustomerInfo/:cusId')
        .get(UserController.getCustomerInfo);
    
    app.route('/api/getDriverInfo/:driverId')
        .get(UserController.getDriverInfo);
        
    // io
    app.route('/io')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/public/socket.html'); 
        });
    
    // test db
    
    app.route('/testdb-cus')
        .get(function(req, res) {
            pool.getConnection(function(err, conn) {
                if (err) throw err;
                
                conn.query('select * from customer', function(err, rows) {
                    if (err) throw err;
                    
                    conn.release();
                    res.json(rows);
                });
            });
        });
    
};