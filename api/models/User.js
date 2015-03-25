/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var bcrypt = require('bcrypt');
 
module.exports = {
 
  schema: true, 

  attributes: {

    name: {
      type: 'string',
      required: true
    },

    company: {
      type: 'string',
      required: true
    },

  /**  slug: {
      type: 'string',
    },*/

    admin: {
      type: 'boolean',
      defaultsTo: true
    },

    online: {
      type: 'boolean',
      defaultsTo: false
    },

    email: {
      type: 'string',
      email: true,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    toJSON: function() {
      var obj = this.toObject();
      delete obj.password;
      delete obj._csrf;
      delete obj.confirmation;
      return obj;
    }
  },

  beforeValidation: function (values, next) {
    //console.log(values.admin[0] + 'and' + values.admin[1]);
    if (typeof values.admin !== 'undefined') {
      if (values.admin === 'unchecked') {
        values.admin = false;
      }else if (values.admin[1] === 'on') {
        values.admin = true;
      }
    }
    next();
  },
 
  beforeCreate: function(user, next) {

    //this checks to make sure the password and confirmation match before creating record

    if (!user.password || user.password != user.confirmation) {
      return next({err: ["Password doesn't match password confirmation."]});
    }

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

   /** if (!user.username) {
      return next({err: ["Must have a username!"]});
    }
    user.slug = user.username.replace(/\s+/g, '').toLowerCase();
    next();*/
  }
 
};
