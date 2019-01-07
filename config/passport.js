
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //"strategy" defined by passport middleware
const auth = require('./auth.js'); //Has Client ID & Secret
const User = require('./userModel'); //User model/schema

module.exports = function(passport){ //Wrapping to run logic when it is called

	//usato per serializzare l'utente
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});
	//usato per deserializzare l'utente
	passport.deserializeUser(function(id,done){
		done(null, id);
	});

	//Google login strategy
	passport.use(new GoogleStrategy({
		clientID : auth.googleAuth.ClientID,
		clientSecret : auth.googleAuth.ClientSecret,
		callbackURL : auth.googleAuth.CallbackURL,
		passReqToCallback: true
	},
	//Function executed after callback
	function(req, accessToken, refreshToken, profile, done) {
		//Check if user is already logged in
		if(!req.user){
			//User is not logged in. Search db for user id
			User.findOne({
				id : profile.id
			}, function(err, user){
				if(err)
					return done(err);

				if(user){
					//User exist in db but doesnt have a token (should never happen)
					if(!user.token){
						user.token = accessToken;
						user.name = profile.displayName;
						user.email = profile.emails[0].value;

						user.save(function(err){
							if(err)
								return done(err);
							return done(null, err);
						});
					}
					return done(null, user);

				}else{
					//User doesn't exist in db, therefore we create one
					let newUser = new User();
					newUser.id = profile.id;
					newUser.token = accessToken;
					newUser.name = profile.displayName;
					newUser.email = profile.emails[0].value;

					newUser.save(function(err){
						if(err)
							return done(err);
						return done(null, newUser);
					});
				}
			});
		}

		else{
			//User exists in db and is already logged in
			let user = req.user;
			user.id = profile.id;
			user.token = accessToken;
			user.name = profile.displayName;
			user.email = profile.emails[0].value;

			user.save(function(err){
				if(err)
					return done(err);
				return done(null, user);
			});
		}
	}));
};
