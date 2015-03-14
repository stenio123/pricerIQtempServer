/**
* Todo.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  schema: true, 
  attributes: {
    title: {
      type: 'string',
    //  required: true
    },
    isCompleted: {
      type: 'boolean',
      //required: true
    },
//a client can have many quotes associated to them
    bobo: {
      type: 'integer'
    }
  }
};
