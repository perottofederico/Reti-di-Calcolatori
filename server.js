

//Listing all requirements;
const express = require('express'); //Webapp framework (kinda)
const http = require('http'); //Because server response will br displayed as html. Do i need this?
const path = require('path'); //Required to work with directories
const methods = require('methods'); //Lowercase http methods and more.
const bodyParser = require('body-parser'); //Middleware to parse the req.body property, before handlers.
const session = require('express-session'); //Creates a middleware for the session, with the given options.
const cors = require('cors'); //Cross-origin resource sharing (Do i need this?)
const passport = require('passport'); //Autentication middleware. Required for oAuth.
const errorHandler = require('errorhandler'); //Error handler for development environment.
//const mongoose = require('mongoose'); MongoDB. Maybe will use couchDB
const morgan = require('morgan'); //HTTP request logger middleware
var routes = require('./routes');

const views = __dirname+'/views'; //Directory for html files. Will probably move when routes are set up
const port = process.env.PORT || 3000; //Server port



//creating global app object
var app = express();

//Express config defaults
//app.use(cors());
app.use(morgan('dev'));
app.use('/', routes);
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//app.use(require('method-override')());
app.use(express.static(__dirname+'/public')); //Load static files in public folder




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