const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const replyController = require('../controllers/reply.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');


router.post('/', 
    check('content').notEmpty().isString().withMessage('content should not be empty and be string').trim().escape(),
    check('reviewID').notEmpty().isNumeric().withMessage('reviewID should be number').trim(),
    check('replyParentID').optional().notEmpty().isNumeric().withMessage('replyParentID should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(), 
    replyController.postReply 
)

router.put('/:replyID',
    check('replyID').notEmpty().isNumeric().withMessage('replyID should not be empty and be a number').trim(),
    check('content').notEmpty().isString().withMessage('content should not be empty').trim().escape(),
    checkValidationResult,
    jwt.verifyToken(), 
    replyController.putReply
)

router.get('/review/:reviewID',
    check('reviewID').notEmpty().isNumeric().withMessage('reviewID should not be empty and be a number').trim(),
    checkValidationResult,
    replyController.getReply('reviewID')
)

router.get('/rereply/:replyParentID',
    check('replyParentID').notEmpty().isNumeric().withMessage('replyParentID should not be empty and be a number').trim(),
    checkValidationResult,
    replyController.getReply('rereply')
)

router.get('/user/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should be email').trim(),
    checkValidationResult,
    replyController.getReply('userID')
)

router.delete('/:replyID/:reviewID',
    check('replyID').notEmpty().isNumeric().withMessage('replyID should not be empty and be a number').trim(),
    check('reviewID').notEmpty().isNumeric().withMessage('reviewID should not be empty and be a number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    replyController.deleteReply
)

module.exports = router;