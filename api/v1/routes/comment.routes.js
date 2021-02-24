const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const commentController = require('../controllers/comment.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js')

router.post('/',
    check('communityID').notEmpty().isNumeric().withMessage('communityID should not be empty').trim(),
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.postComment
);

router.get('/parent/:communityID', 
    check('communityID').notEmpty().isNumeric().withMessage('communityID should not be empty').trim(),
    checkValidationResult,
    commentController.getCommentsByParent );

router.get('/user/:userID/:pageNumber', 
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty').trim(),
    checkValidationResult,
    commentController.getCommentsByUserID );

router.put('/:commentID',
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    check('commentID').notEmpty().isNumeric().withMessage('commentID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.updateComment );

router.delete('/:commentID', 
    check('commentID').notEmpty().isNumeric().withMessage('commentID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    commentController.deleteComment );

module.exports = router;