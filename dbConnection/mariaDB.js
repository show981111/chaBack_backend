var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '981111',
  database : 'test'
});
 
if(!db._connectCalled ) 
{
	console.log('MariaDB default connection is opened');
	db.connect();
}

process.on('SIGINT', function(){
    console.log('MariaDB default connection is closed');
    db.end();
});

module.exports = db;