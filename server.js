

//Listing all requirements;
const express = require('express'); //Webapp framework (kinda)
//const http = require('http'); Because server response will br displayed as html. Do i need this?
const path = require('path'); //Required to work with directories
const bodyParser = require('body-parser'); //Middleware to parse the req.body property, before handlers.
const session = require('express-session'); //Creates a middleware for the session, with the given options.
const passport = require('passport'); //Autentication middleware. Required for oAuth.
//const mongoose = require('mongoose'); MongoDB. Maybe will use couchDB
const morgan = require('morgan'); //HTTP request logger middleware

const routes = require('./routes');
const port = process.env.PORT || 3000; //Server port

//creating global app object
const app = express();

//Express config defaults
app.use(express.static(__dirname+'/public')); //Load static files in public folder
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());		//To get content of forms

app.set('view engine', 'ejs');	//Render engine
app.set('views', './views');

//Passport setup
app.use(session({secret : 'wbfierfiewrfo',
				resave : true,
				saveUninitialized : true}));
app.use(passport.initialize());
app.use(passport.session());	//persistent sessions for login


require('./routes/index')(app, passport); //Loads routes in the app & configures passport


//TODO: DB implementation.


//Catch 404 error and forward to error handler that prints stacktrace.
app.use(function(req, res, next){
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next){
	console.log(err.stack);
	res.status(err.status || 500);

	res.json({'errors':{
		message: err.message,
		error: err
	}});
});



//Starting the server.
app.listen(port, () =>{
	console.log(`[SERVER.JS] Server listening on port ${port}`);
});