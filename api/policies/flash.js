//prints messages sent to the session
/**usage on html file:
<% if(flash && flash.err) { %>
  <ul class="alert alert-success">
  <% Object.keys(flash.err).forEach(function(error) { %>
    <li><%- JSON.stringify(flash.err[error]) %></li>
  <% }) %>
  </ul>
<% } %>
*/

module.exports = function(req, res, next) {
  res. locals.flash = {};

  if(!req.session.flash) return next();
    
    //session object is not available to the view, but locals is
    //used clone because wants a copy, not a reference pointer (that could change value later) 
  res.locals.flash = _.clone(req.session.flash);

  //clear flash
  req.session.flash = {};

  next();
};