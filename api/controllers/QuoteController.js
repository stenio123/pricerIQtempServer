/**
 * QuoteController
 *
 * @description :: Server-side logic for managing quotes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
   parseFile: function (req, res) {
    if(!req.param('file')) {
      return console.log("needs file!");
    } 
    console.log("test");
    return res.send("File uploaded!");
  },
    indexfile: function (req,res){
    res.writeHead(200, {'content-type': 'text/html'});
    res.end(
    '<form action="http://localhost:1337/quote/upload" enctype="multipart/form-data" method="post">'+
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
        sails.models.quote.create(obj).exec(function createCB(err,created){
          console.log('Created quote with path '+ uploadedFiles[0].fd);

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
          sails.models.quote.create( record, function quoteCreated(err, quote) {
      
            // if there is an error
            if (err) {
              console.log(err);
            };
            console.log("Holla!" + quote);
          })
          
        });
        });
         
        


        //read from file 
        fileStream.pipe(csvConverter);
         /** var fs = require("fs");
          var csv = require("fast-csv");

          var stream = fs.createReadStream(uploadedFiles[0].fd);
 
          var content ='';
          csv
           .fromStream(stream, {headers : true})
           .on("data", function(data){
               console.log(data);
               content = data;
           })
           .on("end", function(){
               console.log("done");
               
           });
           console.log('Content is ' + content);*/

        });



      return res.json({
        message: uploadedFiles.length + ' file(s) uploaded successfully!',
        files: uploadedFiles
      });
    });
  }
};



