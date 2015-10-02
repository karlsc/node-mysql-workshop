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

function enterInformation(){
    prompt.getAsync(["Enter your email address", "Enter your password", "Confirm your password"]).then( function(response){
        
        if(response["Enter your password"] !== response["Confirm your password"]){
            
            console.log("Passwords not matching.");
            return enterInformation();
        }
        else {
            
            return createAccount(response["Enter your email address"],response["Enter your password"]);
        }
    
        
    });
}

function end(){
    connection.end();
}

function createAccount(email,password){
    
    connection.queryAsync("INSERT INTO Account (email,password,createdOn,modifiedOn) VALUES ('"+email+"','"+password+"',NOW(),NOW())").then( function(){
        
        connection.queryAsync("SELECT LAST_INSERT_ID()").then(function(result){
        
            console.log("Your account was succesfuly created.\nAccount ID #"+result[0][0]['LAST_INSERT_ID()']+"\nAccount name: "+email+"\nAccount password: "+password);
            return end();
        });
    });
}

enterInformation();