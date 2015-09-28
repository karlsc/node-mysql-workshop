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

}).map( function(formatArray){
    
    return connection.queryAsync("SELECT * FROM AddressBook WHERE accountId = "+formatArray.id+";").then(
        
        function(custAddressbooks){
            
            var rowsAddressbook = custAddressbooks[0].map(function(addressbookRow) {
                
                return addressbookRow.name;
            });

            return {id: formatArray.id, email: formatArray.email, addressbooks: rowsAddressbook};
        }
    );    
}).then( function(formatArray){
    
    for(var j = 0 ; j < formatArray.length ; j++){
        
        if(formatArray[j].id < 10){
        
            console.log(("\n  #"+formatArray[j].id+": ") .bold +formatArray[j].email+"\n");
            console.log("\tAddress Books:" .bgBlue.white.bold);
        } else if (formatArray[j].id < 100){
            
            console.log(("\n #"+formatArray[j].id+": ") .bold +formatArray[j].email+"\n");
            console.log("\tAddress Books:" .bgBlue.white.bold);
        } else {
            
            console.log(("\n#"+formatArray[j].id+": ") .bold +formatArray[j].email+"\n");
            console.log("\tAddress Books:" .bgBlue.white.bold);
        }
        
        for(var i = 0 ; i < formatArray[j].addressbooks.length ; i++){
            
            console.log("\t"+formatArray[j].addressbooks[i] .rainbow);
        }
    }
}).finally(
    function() {
        connection.end();
    }
);