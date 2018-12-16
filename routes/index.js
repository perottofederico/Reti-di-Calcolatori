var express = require('express');
var router = express.Router();
var path= require('path');
var request = require('request');

router.use(function timeLog(req, res, next){
	console.log('Time: ', Date.now());
	next();
});

router.get('/', function(req, res){
	res.render(path.resolve(__dirname+'/../views/index.ejs'));
});

router.get('/login', function(req, res){
	res.render(path.resolve(__dirname+'/../views/login.ejs'));
});



var film; //Variable including movie info
router.get('/search', function(req, res){
	res.render(path.resolve(__dirname+'/../views/search.ejs'));
});

router.post('/search', function(req, res){
	var options = {url: 'http://www.omdbapi.com/?apikey=2fab0a6a&t='+ req.body.name};
	request.get(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			film = JSON.parse(body);
			console.log(film);
			res.redirect('/film');
		}
	});
});

router.get('/film', function(req, res){
	res.render(path.resolve(__dirname+'/../views/film.ejs'), {
		title:film.Title,
		poster:film.Poster
	});
});


router.get('/visti', function(req, res){
	res.render(path.resolve(__dirname+'/../views/visti.ejs'));
});

module.exports = router;