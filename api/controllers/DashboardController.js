/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Dashboards
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  index: function (req, res, next) {
    res.locals.layout = 'layout-sidebar';
    //check config/globals.js for info on accessing external models!

    var items = sails.models.item.find();
    var clients = sails.models.client.find();
    var quotes = sails.models.quote.find();

    res.view({
        items: items,
        clients: clients,
        quotes: quotes
    });
    /**var costs = sails.models.item.find(function foundItems (err, users) {
      if (err) return next (err);

      
      
    });

    var clients = sails.models.client.find(function foundClients (err, users) {
      if (err) return next (err);

      
      res.view({
        users: users
      });
    });

    var quotes = sails.models.quote.find(function foundQuotes (err, users) {
      if (err) return next (err);

      
      res.view({
        users: users
      });
    });*/
    }
  
};