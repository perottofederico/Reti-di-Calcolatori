module.exports = function(app, passport){ //Wrapping to run logic when it is called
	var path= require('path');
	var request = require('request');
	const mongoose = require('mongoose');
	const User = require(path.resolve(__dirname+'/../config/userModel')); //Loading User model/schema
	const filmSchema = require(path.resolve(__dirname+'/../config/filmModel'));//Loading Film schema
	const Film = mongoose.model('Film', filmSchema); //Defining film Model
	
	//Just a function to log time
	app.use(function timeLog(req, res, next){
		console.log('Time: ', Date.now());
		next();
	});

	//Homepage, which contains film to see list.
	app.get('/', isLoggedIn, function(req, res, next){
		User.findOne({id : req.user}, function(err, user){
			if (err)
				return err;
			res.render(path.resolve(__dirname+'/../views/index.ejs'), {
				User: user
			});
		});
	});

	
	//Login page
	app.get('/login', function(req, res){
		res.render(path.resolve(__dirname+'/../views/login.ejs'));
	});



	

	var film; //Variable including movie info
	//Search page
	app.get('/search', isLoggedIn, function(req, res){
		res.render(path.resolve(__dirname+'/../views/search.ejs'));
	});
	//POST Request for film title to oMDB
	app.post('/search', isLoggedIn, function(req, res){
		var options = {url: 'http://www.omdbapi.com/?apikey=2fab0a6a&t='+ req.body.name};
		request.get(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				film = JSON.parse(body);
				res.redirect('/film');
			}
		});
	});
	//Use result of POST request to oMDB to load page containing film info
	app.get('/film', isLoggedIn, function(req, res){
		res.render(path.resolve(__dirname+'/../views/film.ejs'), {
			title:film.Title,
			poster:film.Poster
		});
	});

	
	//Load films seen list
	app.get('/visti', isLoggedIn, function(req, res, next){
		User.findOne({id : req.user}, function(err, user){
			if (err)
				return done(err);
			res.render(path.resolve(__dirname+'/../views/visti.ejs'), {
				User: user
			});
		});
	});


	//Push a film to films seen array, if conditions are met
	app.post('/visti', isLoggedIn, function(req, res, next){
		let new_film = new Film();
		new_film.title = film.Title;
		new_film.poster = film.Poster;
		User.findOne({id : req.user, films_seen : new_film}, function(err, result){
			//Search in films seen array
			if(err)
				console.log(err);
			if(result == null){
				//If not in film seen, search in films to see
				User.findOne({id: req.user, films_to_see : new_film}, function(err, result){
					if (err)
						console.log(err);
					if (result == null){
						//if not in films to see, update films seen
						User.findOneAndUpdate({id:req.user}, {$push: {films_seen: new_film}},
						function(err, film){ //apparently callback is required to work properly
							if(err)
								console.log(err);
							else
								console.log("[THIS IS THE RESULT OF FINDONEANDUPDATE]"+film);
						});
						res.redirect('/visti');
					}
					else{
						//film found in films to see array
						console.log("[FILM TROVATO NELLA LISTA FILM DA VEDERE]");
						res.redirect('/visti');	
					}
				});
			}
			else{
				//Film found in films seen array
				console.log("Film found, therefore list was not updated")
				res.redirect('/visti');
			}
		});
	});


	//Push a film to films to see array, if conditions are met
	app.post('/addfilm', isLoggedIn, function(req, res){
		let new_film = new Film();
		new_film.title = film.Title;
		new_film.poster = film.Poster;

		User.findOne({id : req.user, films_to_see : new_film}, function(err, result){
			//Search film in films to see array
			if(err)
				console.log(err);
			if(result == null){
				//If not in films to see, search in films seen
				User.findOne({id: req.user, films_seen: new_film}, function(err, result){
					if (err){
						console.log(err);
					}
					if(result == null){
						//If not in films seen, update films to see array
						User.findOneAndUpdate({id:req.user}, {$push: {films_to_see: new_film}},
						function(err, film){
							if(err)
								console.log(err);
							else
								console.log("[THIS IS THE RESULT OF FINDONEANDUPDATE]"+film);
						});
						res.redirect('/');
					}
					else{
						//Film foundo in films seen array
						console.log("[FILM TROVATO NELLA LISTA DI FILM VISTI");
						res.redirect('./visti');
					}
				});
			}

			else{
				//Film already in films to see array
				console.log("Film found, therefore list was not updated")
				res.redirect('/');
			}
		});
	});

	


	//GOOGLE SIGNIN
	app.get('/auth/google', passport.authenticate('google',{ scope : ['profile', 'email'] }));

	app.get('/auth/google/callback', 
		passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/login'
	}));

	app.get('/logout', isLoggedIn, function(req,res){
		req.logout();
		res.redirect('/');
	});
}





function isLoggedIn(req, res, next){
	//If user is logged in, go on
	if (req.isAuthenticated())
		return next();
	//Else redirect to login page
	res.redirect('/login');
}