
//Listing all requirements;
const express = require('express'); //Webapp framework (kinda)
const path = require('path'); //Required to work with directories
const bodyParser = require('body-parser'); //Middleware to parse the req.body property, before handlers.
const cookieParser = require('cookie-parser');
const session = require('express-session'); //Creates a middleware for the session, with the given options.
const passport = require('passport'); //Autentication middleware. Required for oAuth.
const morgan = require('morgan'); //HTTP request logger middleware
const mongoose = require('mongoose'); //MongoDB
const routes = require('./routes');
const port = process.env.PORT || 3000; //Server port
const dburl = require('./config/databaseurl.js');

const User = require(path.resolve(__dirname+'/config/userModel'));

//creating global app object & connecting to db
const app = express();
mongoose.connect(dburl.url);


//Express config defaults
app.use(express.static(__dirname+'/public')); //Load static files in public folder
require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());		//To get content of forms
app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');	//Render engine
app.set('views', './views');


//Passport setup
app.use(session({secret : 'jfbeirvpjfnvpqernvpuebf',
				resave : true,
				saveUninitialized : true}));
app.use(passport.initialize());
app.use(passport.session());	//persistent sessions for login


require('./routes/index.js')(app, passport); //Loads routes in the app & configures passport


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
	/*User.findOne({
		id: '105314313960907808446'
	}, function(err, user){
		if(err)
			return done(err);
		if(user){

		}
	});*/
	console.log(`[SERVER.JS] Server listening on port ${port}`);
});