const express = require('express')
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const likeController = require('../controllers/like.controller.js');

router.post('/review',
    jwt.verifyToken(),
    likeController.postLike('review')
);

router.delete('/review',
    jwt.verifyToken(),
    likeController.deleteLike('review')
);

router.get('/review',
    likeController.getLike('review')
)