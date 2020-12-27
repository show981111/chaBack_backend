const express = require('express')
const app = express()
const port = 3000
const mongoDB = require('./dbConnection/mongoDB.js')
const mariaDB = require('./dbConnection/mariaDB.js')
var communityRouter = require('./api/v1/routes/communities.routes.js');
var commentRouter = require('./api/v1/routes/comments.routes.js');
var userRouter = require('./api/v1/routes/user.routes.js');
const bodyParser = require('body-parser')


app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
mongoDB();

app.use('/api/v1/community', communityRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/user', userRouter);


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
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;





