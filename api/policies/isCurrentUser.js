
/**
 * allow a logged in user to see, edit and update their profile
 * allows admin to see everyone
 * 
 * @param  {request}
 * @param  {response}
 * @param  {next}
 * @return {next}
 */
module.exports = function(req, res, next) {
  if(req.session.User) {
    var sessionUserMatchesId = req.session.User.id === req.param('id');
    var isAdmin = req.session.User.admin;

    if (!(sessionUserMatchesId || isAdmin)) {
      var noRightsError = [{name: 'noRightsError', message: 'I am sorry, but you are not the authorized to access this resource. Please contact your admin.'}];
      req.session.flash = {
        err: noRightsError
      }
      res.redirect('/session/new');
      return;
    }
  } else {
    var notLoggedInError = [{name: 'notLoggedInError', message: 'You must be logged in to do that.'}];
      req.session.flash = {
        err: notLoggedInError
      }
      res.redirect('/session/new');
      return;
  }
  next();
};