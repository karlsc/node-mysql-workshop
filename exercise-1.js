var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);
var Table = require('cli-table');
var colors = require('colors');

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : ''
});

connection.queryAsync("SHOW DATABASES;").then(
    function(results) {
    	
    	var rows = results[0];
    	var table = new Table({
          chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
                 , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
                 , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
                 , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
        });
    	
    	table.push(
                ["Databases:" .bgYellow.black.bold]
            );
            
    	for(var j = 0 ; j < rows.length ; j++){
    	    
    	    table.push(
                [rows[j].Database .rainbow]
            );
    	}
    	
    	console.log(table.toString());
    }
).finally(
    function() {
        connection.end();
    }
);
