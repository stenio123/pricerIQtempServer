/**
 * Passport installation from
 * http://blog.thesparktree.com/post/77311774912/creating-a-sails-application-using-passport
 *  ->attention I had to change on UserController.js from "done" to "exec", since "done" was deprecated in Waterline!
 */

var passport = require('passport'),
LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, exec) {
    exec(null, user.id);
});

passport.deserializeUser(function(id, exec) {
    User.findOneById(id).exec(function (err, user) {
        exec(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, exec) {
    User.findOne({ email: email}).exec(function(err, user) {
          if (err) { return exec(err); }
            if (!user) { return exec(null, false, { message: 'Unknown user ' + email }); }
            if (user.password != password) { return exec(null, false, { message: 'Invalid password' }); }
            return exec(null, user);
        });
    }
)); 