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
        return rows;
    }    

).map(
    
    function(dbNames){ 
        
        return connection.queryAsync("SHOW TABLES FROM "+ dbNames.Database).then(
            
            function(result) {
                
                var rows = result[0].map(function(tableRow) {
                    
                    return tableRow['Tables_in_' + dbNames.Database];
                });

                return {databaseName: dbNames.Database, tableNames: rows};
            }
        );
}).then(
            
    function(mappedRows) {
        
        mappedRows.forEach(function(dbAndTables) {
            
            if (dbAndTables.tableNames.length) {
                
                console.log(dbAndTables.databaseName.bold + ": ");
                
                dbAndTables.tableNames.forEach(function(tableName) {
                    console.log("\t" + tableName.bgWhite.black);
                });
                
            } else {
                
                console.log( (dbAndTables.databaseName + " does not have any tables").bold.red ); 
            }
        });
    }
    
).finally(
    function() {
        connection.end();
    }
);
