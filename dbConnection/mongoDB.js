//require mongoose module
var fs = require('fs');
const path = require("path");

var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//require database URL from properties file
require('dotenv').config();

//export this function and imported by server.js
var mongoDB = function(){

    mongoose.connect(process.env.MONGO_URL, 
        {
        useNewUrlParser: true,
        ssl: true,
        sslValidate: false,
        sslCA: fs.readFileSync(path.resolve(__dirname, './rds-combined-ca-bundle.pem'))
        }
    )
    

    mongoose.connection.on('connected', function(){
        console.log(`Mongoose default connection is open`);
    });

    mongoose.connection.on('error', function(err){
        console.log("Mongoose default connection has occured "+err+" error");
    });

    mongoose.connection.on('disconnected', function(){
        console.log("Mongoose default connection is disconnected");
    });

    process.on('SIGINT', function(){
        mongoose.connection.close(function(){
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0)
        });
    });
}

module.exports = mongoDB;