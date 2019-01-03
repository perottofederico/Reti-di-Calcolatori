module.exports = function(app, passport){ //Wrapping to run logic when it is called
	var path= require('path');
	var request = require('request');
	const User = require(path.resolve(__dirname+'/../config/userModel')); //User model/schema

	
	app.use(function timeLog(req, res, next){
		console.log('Time: ', Date.now());
		next();
	});

	
	app.get('/', isLoggedIn, function(req, res, next){
		User.findOne({id : req.user}, function(err, user){
			if (err)
				return done(err);
			res.render(path.resolve(__dirname+'/../views/index.ejs'), {
				User: user
			});
		});
		//res.render(path.resolve(__dirname+'/../views/index.ejs'));
	});

	
	app.get('/login', function(req, res){
		res.render(path.resolve(__dirname+'/../views/login.ejs'));
	});



	

	var film; //Variable including movie info
	app.get('/search', isLoggedIn, function(req, res){
		res.render(path.resolve(__dirname+'/../views/search.ejs'));
	});

	app.post('/search', isLoggedIn, function(req, res){
		var options = {url: 'http://www.omdbapi.com/?apikey=2fab0a6a&t='+ req.body.name};
		request.get(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				film = JSON.parse(body);
				console.log(film);
				res.redirect('/film');
			}
		});
	});

	app.get('/film', isLoggedIn, function(req, res){
		res.render(path.resolve(__dirname+'/../views/film.ejs'), {
			title:film.Title,
			poster:film.Poster
		});
	});

	app.get('/visti', isLoggedIn, function(req, res, next){
		User.findOne({id : req.user}, function(err, user){
			if (err)
				return done(err);
			res.render(path.resolve(__dirname+'/../views/visti.ejs'), {
				User: user
			});
		});
		//res.render(path.resolve(__dirname+'/../views/visti.ejs'));
	});



	app.get('/logout', isLoggedIn, function(req,res){
		req.logout();
		res.redirect('/');
	});


	//GOOGLE SIGNIN
	app.get('/auth/google', passport.authenticate('google',{ scope : ['profile', 'email'] }));

	app.get('/auth/google/callback', 
		passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/login'
	}));
}



function isLoggedIn(req, res, next){
	//If user is logged in, go on
	if (req.isAuthenticated())
		return next();
	//Else redirect to homepage
	res.redirect('/login');
}