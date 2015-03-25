/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var bcrypt = require('bcrypt');

module.exports = {

  'new': function(req, res) {
   // res.locals.layout = 'layout-sidebar';

    //var oldDateObj = new Date();
    //var newDateObj = new Date(oldDateObj.getTime() + 60000); //60 secs
    //req.session.cookie.expires = newDateObj;

    //req.session.authenticated = true;
    res.view('session/new');
  },

  'create': function(req, res, next) {
   // res.locals.layout = 'layout-sidebar';
    //check if email and password sent, if none redirect back
    if(!req.param('email') || !req.param('password')) {
     // return next({err: ["Password doesn't match password confirmation."]});

      var usernamePasswordRequiredError = [{name: 'usernamePasswordRequired', message: 'You must enter both a username and password.'}];

      req.session.flash = {
        err: usernamePasswordRequiredError
      }

      res.redirect('/session/new');
      return;
    }

    //try to find the user by the email address using dynamic finder
    User.findOneByEmail(req.param('email'), function foundUser (err, user) {
      if (err) return next(err);

      //if no user found...
      if (!user) {
        var noAccountError = [{name: 'noAccount', message: 'The email address ' + req.param('email') + ' not found.'}];
        req.session.flash = {
          err: noAccountError
        }
        res.redirect('/session/new');
        return;
      }

      //compare password
      bcrypt.compare(req.param('password'), user.password, function(err, valid) {
        if (err) return next(err);
        //if password doesnt match
        if (!valid) {
          var usernamePasswordMismatchError = [{name: 'usernamePasswordMismatch', message: 'Invalid username and password combination.'}];
          req.session.flash = {
            err: usernamePasswordMismatchError
          }
          res.redirect('/session/new');
          return;
        }

        //log user in
        req.session.authenticated = true;
        req.session.User = user;

        // Inform subscribed sockets that this user logged in
        User.publishUpdate(user.id, {
          loggedIn: true,
          id: user.id,
          name: user.name,
          action: ' has logged in.'
        });
        
        user.online = true;
        user.save(function(err, user) {
        if (err) return next(err);

        //if user is also admin, redirect to user list /views/user/index.ejs
        //used in conjunction with config/policies.js
        if (req.session.User.admin) {
          //TODO APPLICATION FLOW!!!res.redirect('/dashboard/index');
          res.redirect('/dashboard/index');
          return;
        }

        //redirect to their profile page /views/user/show.ejs
        res.redirect('/dashboard/index/');// + user.id);
      });
      });
    });
    
  },

  destroy: function(req, res, next) {

    User.findOne(req.session.User.id, function foundUser(err, user) {
      var userId = req.session.User.id;

      User.update(userId, {
        online: false
      }, function(err) {
        if (err) return next(err);

// Inform subscribed sockets that this user logged out
/**
        User.publishUpdate(user.id, {
          loggedIn: false,
          id: user.id,
          name: user.name,
          action: ' has logged out.'
        });
*/

        req.session.destroy();
        res.redirect('session/new');
      });
    });
    
  }
  
};

