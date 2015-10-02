var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var colors = require('colors');
var prompt = Promise.promisifyAll(require('prompt'));

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

var offsetValue = 0;

function pagination(){

connection.queryAsync("SELECT * FROM Account LIMIT 10 OFFSET "+offsetValue).then(
    function(results) {
        
    	var formatResults = results[0];
    	
    	for(var i = 0 ; i < 10 ; i++){
        	    
            console.log("ID #"+formatResults[i].id+" | Email: "+formatResults[i].email+" | Password: "+formatResults[i].password+" | Created on: "+formatResults[i].createdOn);
        }
    	
        return prompt.getAsync(["See next 10 entries? (Y/n)"]);
        
        }).then( function(response) {
        	    
            if(response["See next 10 entries? (Y/n)"] === "Y" || response["See next 10 entries? (Y/n)"] === "y"){
                
               if(offsetValue >= 990){
                   
                   end();
               } else {
                   
                   offsetValue += 10;
               return pagination();
               }
                
            } else if(response["See next 10 entries? (Y/n)"] === "N" || response["See next 10 entries? (Y/n)"] === "n"){
                
                return;
            } else {
                
                console.log("Wrong selection.");
                return;
            }
        });
}

function end() {
        connection.end();
}

pagination();