/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/
var bcrypt = require('bcrypt');

module.exports = {

  attributes: {
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      },
      email: {
          type: 'email'
      },
      provider: {
          type: 'string'
      },
      provider_id:{
          type: 'string'
      },
      password: {
          type: 'string'
      }
  },
  beforeCreate: function(user, next) {

    //this checks to make sure the password and confirmation match before creating record

    //if (!user.password || user.password != user.confirmation) {
    //  return next({err: ["Password doesn't match password confirmation."]});
   // }

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
          next(err);
        }else{
          user.password = hash;
          next();
        }
      });
    });

  //to use slugs instead of id
   /** if (!user.username) {
      return next({err: ["Must have a username!"]});
    }
    user.slug = user.username.replace(/\s+/g, '').toLowerCase();
    next();*/
  },
  // checking if password is valid
  checkPassword: function(password) {
    return bcrypt.compare(password, this.local.password, function(err, res) {
    // res == true 
    });
  }

  
};


