# server

a [Sails](http://sailsjs.org) application

In order for user login to work, you need to update the file config/blueprints.js. This is because Ember
uses pluralized routes (i.e. "Clients"), while Sails use singular routes (i.e. "Client").

The actual logic to handle this difference is done at api/blueprints. But it can be toggled on/off
by changing config/blueprints.js.

Option 1:  No Ember client, just using existing routes

Change config/blueprints.js on line 118 

pluralize: false;

Create user: localhost:1337/user and submit 
Login user in session: localhost:1337/user/login

Option 2: using Ember client

Change config/blueprints.js on line 118 

pluralize: false;

Create user: send JSON object to localhost:1337/user/create  
Login user in session: send JSON object to ocalhost:1337/user/login