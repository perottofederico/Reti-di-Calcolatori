const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const path = require('path');

const morgan = require('morgan');
app.use(morgan('dev'));

//require('./app/routes.js');
app.use(express.static(__dirname+('/views')));

app.get('/', function(req, res){
	res.sendFile('index.html');
});

app.get('/login', function(req, res){
	res.sendFile(path.join(__dirname +'/views/login.html'));
});

app.get('/visti', function(req, res){
	res.sendFile('/visti.html');
});

app.listen(port, () =>{
	console.log(`Server listening on port ${port}`);
});