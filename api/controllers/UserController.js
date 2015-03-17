/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var passport = require('passport');
module.exports = {
    new: function (req,res)
    {
        res.view();
    },
    create: function (req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    //create user with params from new.ejs

    var userObj = {
        email: req.param('email'),
        password: req.param('password'),
        _csrf: req.param('_csrf')
      } 

    User.create( userObj, function userCreated(err, user) {
      
      // if there is an error
      if (err) {
        console.log(err);
        req.session.flash = {
          err: err
      }
        return res.redirect('/user/new');
      }

      req.session.authenticated = true;
      req.session.User = user;

      user.online = true;
      user.save(function(err, user) {
        if (err) return next(err);

        res.redirect('user/show/'+user.id);
      });
      //after successfully creating user
      // redirect to the show action
      //NOTE based on config/blueprints.js, creates CRUD routes automatically
     // res.json(user);
      
    });
  },
    //render profile view (/views/show.ejs)
  show: function (req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },
    login: function (req,res)
    {
        res.view();
    },

    passport_local: function(req, res)
    {
        passport.authenticate('local', function(err, user, info)
        {
            if ((err))
            {
                res.redirect('/user/login');
                console.log("Couldn't login, error: " + err);
                return;
            } else if (!user) {
                      res.redirect('/user/login');
                      console.log("Couldn't find user in database!");
                      return;
                    }

            req.logIn(user, function(err)
            {
                if (err)
                {
                    res.redirect('/user/login');
                    console.log("Sorry, couldnt logn, error:" + err);
                    return;
                }
                console.log("Login successful");
                res.redirect('/');
                return;
            });
        })(req, res);
    },

    logout: function (req,res)
    {
        req.logout();
        res.redirect('/');
    },



  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}


};