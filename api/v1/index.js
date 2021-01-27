const express = require('express')
const router = express()

var communityRouter = require('./routes/communities.routes.js');
var commentRouter = require('./routes/comments.routes.js');
var userRouter = require('./routes/user.routes.js');
var authRouter = require('./routes/auth.routes.js');
var placeRouter = require('./routes/place.routes.js');
var reviewRouter = require('./routes/review.routes.js');
var replyRouter = require('./routes/reply.routes.js');
var resourcesRouter = require('./routes/resources.routes.js');
var likeRouter = require('./routes/like.routes.js');
var wishRouter = require('./routes/wish.routes.js');
var gearRouter = require('./routes/gear.routes.js');
var gearReviewRouter = require('./routes/gear_review.routes.js');

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
router.use('/community', communityRouter);
router.use('/comment', commentRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/place', placeRouter);
router.use('/review', reviewRouter);
router.use('/reply', replyRouter);
router.use('/resources', resourcesRouter);
router.use('/like', likeRouter);
router.use('/wish', wishRouter);
router.use('/gear', gearRouter);
router.use('/gear-review/',gearReviewRouter);

module.exports = router;





