var authToken = require(process.cwd() + '/app/db/lokijs/auth-token.js');
var connection = require(process.cwd() + '/app/db/mysql/connection');

module.exports = function(req, res) {
    var token = req.cookies.token;
    var tokenDoc = authToken.findOne({token: token});
    
    if (!tokenDoc) {
        res.redirect('/auth/login');
    } else {
        connection.query('SELECT * FROM ? WHERE email LIKE ? OR phone LIKE ?;', 
            [tokenDoc.accountType, tokenDoc.email, tokenDoc.phone], function(err, rows) {
                if (err) throw err;
                
                if (!rows[0]) {
                    res.redirect('/auth/login');
                } else {
                    delete rows[0].password;
                    res.json({errCode: 0, msg: 'Session logged in successfully', data: rows[0]});
                }
            });
    }
};