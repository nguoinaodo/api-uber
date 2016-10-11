var http = require('http');
var express = require('express');

var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var routes = require(process.cwd() + '/app/routes/index.js');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');


var ioController = require(process.cwd() + '/app/controllers/ioController.js');

require('./app/configs/passport')(passport);
require('dotenv').load();

app.use(bodyParser.urlencoded({extended: false}));

app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

app.use(session({
	secret: 'uber',
	resave: true,
	saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

routes(app, passport);

ioController(io);

server.listen(process.env.PORT, function() {
    console.log('Server is listening');
});