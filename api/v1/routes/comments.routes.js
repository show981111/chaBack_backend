const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const commentController = require('../controllers/comments.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js')

var postValidator = [
    check('parentID').notEmpty().isLength({min : 24, max :24}).withMessage('parentID should not be empty and 24 hex characters').trim(),
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty').trim(),
    check('userNickName').notEmpty().withMessage('userNickName should only contain alphabet and number').trim(),
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
];

router.post('/',
    postValidator,
    checkValidationResult,
    jwt.verifyToken(),
    commentController.postComment
);

router.get('/parent/:parentID', 
    check('parentID').notEmpty().isLength({min : 24, max :24}).withMessage('parentID should not be empty and 24 hex characters').trim(),
    checkValidationResult,
    commentController.getCommentsByParent );

router.get('/user/:userID', 
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty').trim(),
    checkValidationResult,
    commentController.getCommentsByUserID );

router.put('/:commentID',
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    check('commentID').notEmpty().isLength({min : 24, max :24}).withMessage('commentID should not be empty and 24 hex characters').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.updateComment );

router.delete('/:commentID', 
    check('commentID').notEmpty().isLength({min : 24, max :24}).withMessage('commentID should not be empty and 24 hex characters').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.deleteComment );

//post reply 
router.post('/:replyParentID',
    postValidator,
    check('replyParentID').notEmpty().isLength({min : 24, max :24}).withMessage('replyParentID should not be empty and 24 hex characters').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.postReply
);
module.exports = router;