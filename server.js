var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var routes = require(process.cwd() + '/app/routes/routes.js');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var io = require('socket.io').listen(server);

var ioController = require(process.cwd() + '/app/controllers/ioController.js');
require(process.cwd() + '/app/configs/passport-auth/passport.js')(passport);
require('dotenv').load();

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));

app.use(session({
	secret: 'uber',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

/// io 
var customerSocketIds = [];
ioController(io);

///
server.listen(process.env.PORT, function() {
    console.log('Server is listening');
});