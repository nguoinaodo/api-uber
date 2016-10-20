var passport = require('passport');

module.exports = {
    
    /////////
    login: function(req, res) {
        passport.authenticate('login', function(err, user, info) {
                if (err) throw err;
                
                if (!user) 
                    return res.json({errCode: -1, msg: info.msg});
                    
                req.logIn(user, function(err) {
                    if (err) throw err;
                    
                    return res.json({errCode: 0, data: user});
                });
                
            }) (req, res);
    },
    
    signup: function(req, res)  {
        passport.authenticate('signup', function(err, user, info) {
            if (err) throw err;
            
            if (!user) 
                return res.json({errCode: -1, msg: info.msg});
                    
            req.logIn(user, function(err) {
                if (err) throw err;
                
                return res.json({errCode: 0, data: user});
            });
            
        }) (req, res);
    }
};