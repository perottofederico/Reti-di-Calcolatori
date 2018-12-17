
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var auth = require('./auth.js');

module.exports = function(passport){

	//usato per serializzare l'utente
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});
	//usato per deserializzare l'utente
	passport.deserializeUser(function(id,done){
		User.findById(id,function(err,user){
			done(err,user);
		});
	});

	//GOOGLE LOGIN
	passport.use(new GoogleStrategy({
		clientID : auth.googleAuth.ClientID,
		clientSecret : auth.googleAuth.ClientSecret,
		callbackURL : auth.googleAuth.CallbackURL,
		passReqToCallback: true
	},
	function(accessToken, refreshToken, profile, done) {
    	User.findOrCreate({ googleId: profile.id }, function (err, user) {
        	return done(err, user);
		});
  	}
  	));
};
