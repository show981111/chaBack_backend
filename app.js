const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.port;
const version_one_router = require('./api/v1/index.js');

//body parser 
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false }))
app.use(bodyParser.json())

//versioning
app.use('/api/v1/', version_one_router);


//error handler
app.use((err, req, res, next) => {
    var msg = err;
    res.status(err.status || 500);
    if(err.status == 404) {
        msg = 'not found';
    }
    res.send({
        error: err.message || "internal server error",
        status: err.status || 500,
    });
});

app.listen(port, () => {
  console.log(`ChaBack app listening at http://localhost:${port}`)
})

module.exports = app;





