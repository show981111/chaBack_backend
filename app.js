const express = require('express')
require('dotenv').config();
const app = express()
const port = process.env.port;
// const mongoDB = require('./dbConnection/mongoDB.js')
const mariaDB = require('./dbConnection/mariaDB.js')
var communityRouter = require('./api/v1/routes/communities.routes.js');
var commentRouter = require('./api/v1/routes/comments.routes.js');
var userRouter = require('./api/v1/routes/user.routes.js');
var authRouter = require('./api/v1/routes/auth.routes.js');
var placeRouter = require('./api/v1/routes/place.routes.js');
var reviewRouter = require('./api/v1/routes/review.routes.js');
var replyRouter = require('./api/v1/routes/reply.routes.js');
var resourcesRouter = require('./api/v1/routes/resources.routes.js');

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerOptions = {
	swaggerDefinition: {
		info : {
			title: 'chaBack',
			version: '1.0.0',
			description: 'Api description for chaBack',
		},
        basePath: "/api/v1",
	},
	apis : ["./api/v1/docs/*.yaml"]
};

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
// mongoDB();

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/community', communityRouter);
app.use('/api/v1/comment', commentRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/place', placeRouter);
app.use('/api/v1/review', reviewRouter);
app.use('/api/v1/reply', replyRouter);
app.use('/api/v1/resources', resourcesRouter);


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





