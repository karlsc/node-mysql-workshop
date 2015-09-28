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
    
    if(arrayAccounts.id < 10){
    
        console.log(("  #"+arrayAccounts.id+": ") .bold +arrayAccounts.email);
    } else if (arrayAccounts.id < 100){
        
        console.log((" #"+arrayAccounts.id+": ") .bold +arrayAccounts.email);
    } else {
        
        console.log(("#"+arrayAccounts.id+": ") .bold +arrayAccounts.email);
    }
}).finally(
    function() {
        connection.end();
    }
);
