const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.port;
const version_one_router = require('./api/v1/index.js');
const logger = require('./config/winston.js');
// // use helmet
// var helmet = require('helmet')

// // app.use(helmet.contentSecurityPolicy());
// app.use(helmet.dnsPrefetchControl());
// app.use(helmet.expectCt());
// app.use(helmet.frameguard());
// app.use(helmet.hidePoweredBy());
// app.use(helmet.hsts());
// app.use(helmet.ieNoOpen());
// app.use(helmet.noSniff());
// app.use(helmet.permittedCrossDomainPolicies());
// app.use(helmet.referrerPolicy());
// app.use(helmet.xssFilter());


//body parser 
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false }))
app.use(bodyParser.json())

//versioning
app.use('/api/v1/', version_one_router);

//error handler
app.use((err, req, res, next) => {
    
    res.status(err.status || 500);
  
    var errorInformation = {
        path : req.originalUrl,
        msg : err.message,
        status : err.status,
        body : req.body,
        parmas : req.params
    }
    logger.error(JSON.stringify(errorInformation));
    res.send({
        error: err.message || "internal server error",
        status: err.status || 500,
    });
});

app.listen(port, () => {
  console.log(`ChaBack app listening at http://localhost:${port}`)
})

module.exports = app;





