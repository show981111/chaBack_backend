//require mongoose module
var mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
//require database URL from properties file
const dbURL = 'mongodb://localhost:27017/local';

//export this function and imported by server.js
var mongoDB = function(){

    mongoose.connect(dbURL);

    mongoose.connection.on('connected', function(){
        console.log(`Mongoose default connection is open to ${dbURL}`);
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