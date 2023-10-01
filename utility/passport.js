const { Users } = require('../models/userModel');
const passport = require('passport')

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRETKEY;
opts.passReqToCallback= true ;

passport.use(new JwtStrategy(opts, function( req,jwt_payload, done) {
    
   //authenticate by passport-jwt
    Users.findById(jwt_payload.id)
        .then( (user) => {
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        })
        .catch( (err) => {
            return done(err, false);
            
        });
}));
