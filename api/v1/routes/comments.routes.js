const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const commentController = require('../controllers/comments.controller.js');
const {check, validationResult} = require('express-validator');

var postValidator = [
    check('parentID').notEmpty().isLength({min : 24, max :24}).withMessage('parentID should not be empty and 24 hex characters'),
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
    check('userNickName').notEmpty().withMessage('userNickName should only contain alphabet and number'),
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
];

router.post('/',
    postValidator,
    checkValidationResult,
    commentController.postComment
);

router.get('/parent/:parentID', 
    check('parentID').notEmpty().isLength({min : 24, max :24}).withMessage('parentID should not be empty and 24 hex characters'),
    checkValidationResult,
    commentController.getCommentsByParent );

router.get('/user/:userID', 
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty'),
    checkValidationResult,
    commentController.getCommentsByUserID );

router.put('/:commentID',
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    check('commentID').notEmpty().isLength({min : 24, max :24}).withMessage('commentID should not be empty and 24 hex characters'),
    checkValidationResult,
    commentController.updateComment );

router.delete('/:commentID', 
    check('commentID').notEmpty().isLength({min : 24, max :24}).withMessage('commentID should not be empty and 24 hex characters'),
    checkValidationResult,
    commentController.deleteComment );

//post reply 
router.post('/:replyParentID',
    postValidator,
    check('replyParentID').notEmpty().isLength({min : 24, max :24}).withMessage('replyParentID should not be empty and 24 hex characters'),
    checkValidationResult,
    commentController.postReply
);
module.exports = router;