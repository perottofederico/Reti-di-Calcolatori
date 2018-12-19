
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //"strategy" defined by passport middleware
var auth = require('./auth.js'); //Has Client ID & Secret

module.exports = function(passport){ //Wrapping to run logic when it is called

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
	//Function executed after callback (TODO)
	function(accessToken, refreshToken, profile, done) {
    	User.findOrCreate({ googleId: profile.id }, function (err, user) {
        	return done(err, user);
		});
  	}
  	));
};
