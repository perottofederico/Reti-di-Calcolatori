const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
	title : String,
	poster : String
}, {_id : false });

module.exports = filmSchema;