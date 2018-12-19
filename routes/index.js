module.exports = function(app, passport){ //Wrapping to run logic when it is called
var express = require('express');
	var path= require('path');
	var request = require('request');

	app.use(function timeLog(req, res, next){
		console.log('Time: ', Date.now());
		next();
	});

	app.get('/', function(req, res){
		res.render(path.resolve(__dirname+'/../views/index.ejs'));
	});

	app.get('/login', function(req, res){
		res.render(path.resolve(__dirname+'/../views/login.ejs'));
	});



	var film; //Variable including movie info
	app.get('/search', function(req, res){
		res.render(path.resolve(__dirname+'/../views/search.ejs'));
	});

	app.post('/search', function(req, res){
		var options = {url: 'http://www.omdbapi.com/?apikey=2fab0a6a&t='+ req.body.name};
		request.get(options, function(error, response, body){
			if(!error && response.statusCode == 200){
				film = JSON.parse(body);
				console.log(film);
				res.redirect('/film');
			}
		});
	});

	app.get('/film', function(req, res){
		res.render(path.resolve(__dirname+'/../views/film.ejs'), {
			title:film.Title,
			poster:film.Poster
		});
	});


	app.get('/visti', function(req, res){
		res.render(path.resolve(__dirname+'/../views/visti.ejs'));
	});


	//GOOGLE SIGNIN
	app.get('/auth/google', passport.authenticate('google',{
			scope:['email']
	}));

	app.get('auth/google/callback', passport.authenticate('google', {
		successRedirect : '/',
		failureRedirect : '/login'
	}));

}