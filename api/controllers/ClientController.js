/**
 * ClientController
 *
 * @description :: Server-side logic for managing clients
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	  'index': function(req, res) {
      res.locals.layout = 'layout-sidebar';
      sails.models.client.find(function foundUsers (err, clients) {
        if (err) return next (err);

        /**
         * adds the list of clients to Session variable
         * and informs view which section is being shown
         * (so navbar is highlighted)
         * @TODO  encapsulate this logic in a service?
         * @type {[type]}
         */
        res.view({
          clients: clients,
          sectionItems: "",
          sectionClients: "active",
          sectionQuotes: ""
        });
      });
  },
  indexfile: function (req,res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
    '<form action="http://localhost:1337/client/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="targetFile" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
    )
  }, 

  upload: function (req, res) { 
    req.file('targetFile').
    upload({ dirname: './assets/files' }, function (err, uploadedFiles) { 
      if (err) return res.negotiate(err);
      
      var obj = {
            file: uploadedFiles[0].fd,
            complete: uploadedFiles
        }; 

        //File.create( obj, err);
        sails.models.client.create(obj).exec(function createCB(err,created){
          console.log('Created client with path '+ uploadedFiles[0].fd);

  //http://stackoverflow.com/questions/16831250/how-to-convert-csv-to-json-in-node-js
          //Converter Class 
          var Converter=require("csvtojson").core.Converter;
          var fs=require("fs");
           
          var csvFileName= uploadedFiles[0].fd;
          var fileStream=fs.createReadStream(csvFileName);
          //new converter instance 
          var csvConverter=new Converter({constructResult:true});
           
          //end_parsed will be emitted once parsing finished 
          csvConverter.on("end_parsed",function(jsonObj){
             console.log(jsonObj); //here is your result json object 
             jsonObj.forEach (function (record) {
              sails.models.client.create( record, function clientCreated(err, client) {
          
                // if there is an error
                if (err) {
                  console.log(err);
                };
                console.log("Holla!" + client);
              })
            
            });
          });
           
          


          //read from file 
          fileStream.pipe(csvConverter);
        });
      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles
      });
    });
  }
};

