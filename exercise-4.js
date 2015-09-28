var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var colors = require('colors');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.queryAsync("SELECT * FROM Account LIMIT 10;").then(
    function(results) {
        
    	return results[0];
    }
).map( function(arrayAccounts){
    
    return {id: arrayAccounts.id, email: arrayAccounts.email};

}).then( function(formatArray){
    
    for(var j = 0 ; j < formatArray.length ; j++){
        
        if(formatArray[j].id < 10){
        
            console.log(("  #"+formatArray[j].id+": ") .bold +formatArray[j].email);
        } else if (formatArray[j].id < 100){
            
            console.log((" #"+formatArray[j].id+": ") .bold +formatArray[j].email);
        } else {
            
            console.log(("#"+formatArray[j].id+": ") .bold +formatArray[j].email);
        }
    }
}).finally(
    function() {
        connection.end();
    }
);
