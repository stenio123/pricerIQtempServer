/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

//var async = require("async");

module.exports = {

  //STEP 1: there is a button on index.ejs that calls this function
  // it will load the page views/user/new.ejs
  'new': function (req, res) {
    
    res.view();

  },

  //STEP 2: once the form on new.ejs is submitted, it calls this function
  // passing the parameters typed
  create: function (req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    //create user with params from new.ejs

    var userObj = {
        name: req.param('name'),
        company: req.param('company'),
        email: req.param('email'),
        password: req.param('password'),
        confirmation: req.param('confirmation'),
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

  index: function (req, res) {

    /**async.parallel(
            {
                // Fetch users
                users: function(callback) {
                    DataService.getUsers({}, callback);
                }
            },

            /**
             * Callback function which is been called after all parallel jobs are processed.
             *
             * @param   {null|Error}                    error
             * @param   {{users: sails.model.user[]}}   data
             
            function(error, data) {
                if (error) {
                  //  ResponseService.makeError(error, request, response);
                } else {
                    response.view(data);
                }
            }
        );*/
   // res.locals.layout = 'layout-sidebar';
   
    User.find(function foundUsers (err, users) {
      if (err) return next (err);

      
      res.view({
        users: users
      });
    });
  },

  edit: function (req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    User.findOne(req.param('id'), function foundUser (err,user){
      if (err) return next(err);
      if (!user) return next('User doesn\'t exist.');

      res.view({
        user: user
      });
    });
  },

  update: function (req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    if(req.session.User.admin) {
      var userObj = {
        name: req.param('name'),
        //username: req.param('username'),
        email: req.param('email'),
        admin: req.param('admin')
      } 
    }else {
        var userObj = {
          name: req.param('name'),
        //  username: req.param('username'),
          email: req.param('email')
        }
    }

    User.update(req.param('id'), userObj, function userUpdated (err) {
      if (err) {
        console.log('error updating user! ' + err);
        return res.redirect('/user/edit/' + req.param('id'));
      }

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res, next) {
   // res.locals.layout = 'layout-sidebar';
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);
      });

      res.redirect('/user')
    });
  },

  profile: function(req, res, next) {
    //res.locals.layout = 'layout-sidebar';
    var slug = req.param('slug');

    //this is to prevent the overhead of doing this for every request
    //for exemple assets ot favicon.ico or robots.txt.
    //this heuristics is checking for requests with a dot, and passing them
    //TODO prevent usernames with dot!
    if (slug.match(/\..+$/)) return next();

    User
    .findOneBySlug(slug)
    .exec(function (err, user) {
      if (err) return res.serverError(err);
      if (!user) return next();
      res.view({user:user});
    });
  },

  subscribe: function(req, res) {

    User.find(function foundUsers(err, users) {
      if (err) return next(err);

      //subscribe this socket to the User model classroom
      User.watch(req.socket);

      //subscribe this socket to the user instance rooms
      User.watch(req.socket, users);

      //to avoid warning that is sending html over socket
      res.send(200);
    });
  }

    //welcome: function (req, res) {
    // Get all of the users
    //console.log('hey!');
    //User.find().exec(function (err, users) {
      // Subscribe the requesting socket (e.g. req.socket) to all users (e.g. users)
     // User.subscribe(req.socket, users);
    //});
 // }
  
};
