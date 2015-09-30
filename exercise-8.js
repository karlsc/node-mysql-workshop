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

connection.queryAsync("SELECT * FROM Account WHERE Account.id LIMIT 10").bind({}).then(
    function(results1) {
        
        this.results1 = results1[0];
        var rows = results1[0];
        var idSelected = rows.map(function(x){ return x.id }).join(", ");
    	return connection.queryAsync("SELECT * FROM AddressBook WHERE accountId IN ("+idSelected+") GROUP BY accountId");
}).then(
    function(results2){
        
        return results2[0];
}).map( 
     function(results3){
        
        return connection.queryAsync("SELECT * FROM Entry WHERE addressbookId = "+results3.id+" LIMIT 10"); 
 }).then(   
     function(results4){
         
        var results1 = this.results1;
         
        for(var i = 0 ; i < results4.length ; i++){
            
            if(results4[i][0][0] === undefined){
                console.log(("\nAccount #"+results1[i].id) .bgBlue.yellow.bold);
                console.log("\nThe first addressbook is empty!" .red.bold);
                
            } else {
                
                console.log(("\nAccount #"+results1[i].id) .bgBlue.yellow.bold);
                console.log(("\nFirst  addressbook ID: #"+results4[i][0][0].addressBookId) .green);
                console.log("\n\tFirst 10 entries\n" .bgBlue.yellow.bold);
                
                for(var j = 0 ; j < results4[i][0].length ; j++){
                    console.log(("\t#"+(j+1)+": "+results4[i][0][j].lastName+", "+results4[0][0][j].firstName) .rainbow);
                }
            }
        }
    }        
).finally(
    function() {
        connection.end();
    }
);