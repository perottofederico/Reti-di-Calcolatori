var express = require('express');
var router = express.Router();
var path= require('path');

router.use(function timeLog(req, res, next){
	console.log('Time: ', Date.now());
	next();
});

router.get('/', function(req, res){
	res.sendFile(path.resolve(__dirname+'/../views/index.html'));
});

router.get('/login', function(req, res){
	res.sendFile(path.resolve(__dirname+'/../views/login.html'));
});

router.get('/ricerca', function(req, res){
	res.sendFile(path.resolve(__dirname+'/../views/ricerca.html'));
});

router.get('/visti', function(req, res){
	res.sendFile(path.resolve(__dirname+'/../views/visti.html'));
});

module.exports = router;