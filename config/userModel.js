const mongoose = require('mongoose');
const Film = require('./filmModel')

const userSchema = mongoose.Schema({
	email : String,
	id : String,
	token : String,
	name: String,
	films_seen : [Film],
	films_to_see : [Film]
});

module.exports = mongoose.model('User', userSchema);


/*exports.addFilm = function(req, res, next){
	var film = {
		title : req.body.title,
		poster : req.body.poster
	}

	User.findOneAndUpdate({id : profile.id, });
}*/