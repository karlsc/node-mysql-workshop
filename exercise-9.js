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

connection.queryAsync("SELECT * FROM Account").then(
    function(results) {
        
    	var formatResults = results[0];
    	
    	for(var j = 0 ; j < formatResults.length/10 ; j++){
    	    
    	    
    	
    	}
    	
    	
    	
    	var idAt = 0;
    	var idToGo = 10;
    	
    	for(var j = 0 ; j < formatResults.length/10 ; j++){
    	
    	
    	for(var i = idAt ; i < idToGo ; i++){
    	    
    	    console.log("ID #"+formatResults[i].id+" | Email: "+formatResults[i].email+" | Password: "+formatResults[i].password+" | Created on: "+formatResults[i].createdOn);
    	}
    	
    	prompt.getAsync(["See next 10 entries? (Y/n)"]).then( test()
    	    
    	   // function(response) {
            
        //     if(response["See next 10 entries? (Y/n)"] === "Y" || response["See next 10 entries? (Y/n)"] === "y"){
                
        //         idAt = idAt +10;
        //         idToGo = idToGo +10;
                
                
        //     } else if(response["See next 10 entries? (Y/n)"] === "N" || response["See next 10 entries? (Y/n)"] === "n"){
                
        //         return;
        //     } else {
                
        //         console.log("Wrong selection.");
        //         return;
        //     }
        // }
        );
    	
    	
    	}
    	
    	
}).finally(
    function() {
        connection.end();
    }
);


function test(){
    console.log("test");
}