const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	email : String,
	id : String,
	token : String,
	name: String,
	films_seen : {},
	films_to_see : {}
});

module.exports = mongoose.model('User', userSchema);