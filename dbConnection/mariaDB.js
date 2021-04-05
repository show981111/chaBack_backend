var mysql = require('mysql');
require('dotenv').config();

var db = mysql.createConnection({
  host     : process.env.mariaDB_host,
  user     : process.env.mariaDB_user,
  password : process.env.mariaDB_password,
  database : process.env.mariaDB_database,
  charset : 'utf8mb4'
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