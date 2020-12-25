const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const commentController = require('../controllers/comments.controller.js');
const {check, validationResult} = require('express-validator');

// parentID : {type : ObjectID, ref : 'communities', required : true},
// userID : {type : String, required : true},
// userNickName : {type : String, required : true},
// updated : { type: Date, default: Date.now },
// content : { type : String, required : true}

router.post('/', [
        check('parentID').notEmpty().isLength({min : 24, max :24}).withMessage('content should not be empty and 24 hex characters'),
        check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
        check('userNickName').notEmpty().isAlphanumeric().withMessage('userNickName should only contain alphabet and number'),
        check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    ],
    checkValidationResult,
    commentController.postComment
);

module.exports = router;