const express = require('express')
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const likeController = require('../controllers/like.controller.js');
const {check, validationResult} = require('express-validator');
const checkValidationResult = require('../middleware/checkValidationResult');

//req.body.userID, req.body.id
router.post('/review/:id',
    check('id').notEmpty().isNumeric().withMessage('id should not be empty and be a number'),
    checkValidationResult,
    jwt.verifyToken(),
    likeController.postLike('review')
);

router.delete('/review/:id',
    check('id').notEmpty().isNumeric().withMessage('id should not be empty and be a number'),
    checkValidationResult,  
    jwt.verifyToken(),
    likeController.deleteLike('review')
);

router.get('/review/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty and be an email'),
    checkValidationResult,  
    likeController.getLike('review')
)

module.exports = router;