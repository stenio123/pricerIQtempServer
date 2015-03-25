/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
/**module.exports = function(req, res, next) {

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  // User is not allowed
  // (default res.forbidden() behavior can be overridden in `config/403.js`)
  return res.forbidden('You are not permitted to perform this action.');
};*/

/**
 * Allow any authenticated user.
 */
module.exports = function (req, res, next) {
 
  // User is allowed, proceed to controller
  var is_auth = req.session.authenticated;
  if (is_auth) {
   // sails.log.warn("auth!");
    return next();
  }
  // User is not allowed
  else {
    var requireLoginError = [{name: 'requireLogin', message: 'You must be signed in.'}];
    req.session.flash = {
      err: requireLoginError
    }
    //sails.log.warn("nope!");
    return res.redirect("/session/new");
  }
};
