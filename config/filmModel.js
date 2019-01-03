const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
	title : String,
	poster : String
});

module.exports = filmSchema