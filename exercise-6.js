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

connection.queryAsync("SELECT * FROM Account LIMIT 10;").bind({}).then(
    function(result) {
        
        this.result = result;
        
        var rows = result[0];
        var idSelected = rows.map(function(x){ return x.id }).join(", ");
    	return connection.queryAsync("SELECT * FROM AddressBook WHERE accountId IN ("+idSelected+");");
}).then( 
    function(results){
    
        var result = this.result;
        var accounts = {};
        
        for (var i = 0; i < results[0].length; i++) {
            
            var entries = results[0];
            var entry = entries[i];
            var accountId = entry.accountId;
            
            if(!accounts[accountId]){
                
                accounts[accountId] = {id: accountId, email: entry.email, addressBooks: []};
            }
            accounts[accountId].addressBooks.push(entry.name);
        }    
        var keysFormatArray = Object.keys(accounts);
    
        for(i = 0 ; i < keysFormatArray.length ; i++){
            
            if(keysFormatArray[i] < 10){
                console.log(("\n  #"+accounts[keysFormatArray[i]].id+": ") .bold +result[0][i].email+"\n");
                console.log("\tAddress Books:" .bgBlue.white.bold);
            } else if (keysFormatArray[i] < 100){
                console.log(("\n #"+accounts[keysFormatArray[i]].id+": ") .bold +result[0][i].email+"\n");
                console.log("\tAddress Books:" .bgBlue.white.bold);
            } else {
                console.log(("\n#"+accounts[keysFormatArray[i]].id+": ") .bold +result[0][i].email+"\n");
                console.log("\tAddress Books:" .bgBlue.white.bold);
            }
            
            for(var j = 0 ; j < accounts[keysFormatArray[i]].addressBooks.length ; j++){
                console.log("\t"+accounts[keysFormatArray[i]].addressBooks[j] .rainbow); 
            }
        }
    }        
).finally(
    function() {
        connection.end();
    }
);