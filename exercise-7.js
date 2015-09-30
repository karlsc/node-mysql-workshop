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

connection.queryAsync("SELECT Account.id AS accountId, Account.email AS accountEmail, Account.password AS accountPassword, Account.createdOn AS accountCreatedOn, Account.modifiedOn AS accountModifiedOn, AddressBook.id AS addressBookId, AddressBook.accountId AS addressBookAccountId, AddressBook.name AS addressbookName, AddressBook.createdOn AS addressbookCreatedOn, AddressBook.modifiedOn AS addressbookModifiedOn FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id").then(
    function(results) {
    	var rows = results[0];
    	var accounts = {};
    	
    	for(var i = 0 ; i < rows.length ; i++){
    	    
    	    var entry = rows[i];
    	    var accountId = entry.accountId;
    	    
    	    if(!accounts[accountId]){
    	        accounts[accountId] = {id: accountId, email: entry.accountEmail, addressBooks: []};
    	    }
    	    accounts[accountId].addressBooks.push(entry.addressbookName);
    	}
    	
    	var keysFormatArray = Object.keys(accounts);
    
        for(i = 0 ; i < keysFormatArray.length ; i++){
            
            if(keysFormatArray[i] < 10){
                console.log(("\n  #"+accounts[keysFormatArray[i]].id+": ") .bold +accounts[keysFormatArray[i]].email+"\n");
                console.log("\tAddress Books:" .bgBlue.white.bold);
            } else if (keysFormatArray[i] < 100){
                console.log(("\n #"+accounts[keysFormatArray[i]].id+": ") .bold +accounts[keysFormatArray[i]].email+"\n");
                console.log("\tAddress Books:" .bgBlue.white.bold);
            } else {
                console.log(("\n#"+accounts[keysFormatArray[i]].id+": ") .bold +accounts[keysFormatArray[i]].email+"\n");
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
