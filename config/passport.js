
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy; //"strategy" defined by passport middleware
var auth = require('./auth.js'); //Has Client ID & Secret
const User = require('./userModel');

module.exports = function(passport){ //Wrapping to run logic when it is called

	//usato per serializzare l'utente
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});
	//usato per deserializzare l'utente
	passport.deserializeUser(function(id,done){
		done(null, id);
	});

	//GOOGLE LOGIN
	passport.use(new GoogleStrategy({
		clientID : auth.googleAuth.ClientID,
		clientSecret : auth.googleAuth.ClientSecret,
		callbackURL : auth.googleAuth.CallbackURL,
		passReqToCallback: true
	},
	//Function executed after callback (TODO)
	function(req, accessToken, refreshToken, profile, done) {
		/*if(!req.user){
			//User is not logged in
			users.get(profile.id).then((body) =>{
				if(profile.statusCode === 200){
					return done(null, body);
				}
				else{
					users.insert({
						_id : profile.id,
						email : profile.emails[0].value,
						access_token : accessToken,
						film_visti : {},
						film_da_vedere : {}
					});
				}	
			});
		}else{
			//Users exists in db and is logged in
			console.log(req.user);
			var user = req.user;
			user._id = profile.id;
			user.email = profile.emails[0].value;
			user.access_token = accessToken;
		};*/
		if(!req.user){
			User.findOne({
				id : profile.id
			}, function(err, user){
				if(err)
					return done(err);
				if(user){
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
					var newUser = new User();
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
			var user = req.user;
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
