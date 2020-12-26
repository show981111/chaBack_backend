const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const communityController = require('../controllers/communities.controller.js');
const {check, validationResult} = require('express-validator');

var postValidator = [
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
    check('userNickName').notEmpty().withMessage('userNickName should only contain alphabet and number'),
    check('category').notEmpty().withMessage('category should not be empty'),
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    check('imageKey').optional(),
    check('image').optional()// AWS S3 연동으로 이미지 저장 필요 있다 
];

router.get('/', communityController.getAllPosts);

router.get('/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
    checkValidationResult,
    communityController.getPostsByID);

router.post('/', postValidator,
    checkValidationResult,
    communityController.postPosts);

router.put('/:postID',
    [
        check('userID').isEmpty().withMessage('should not contain userID'),
        check('userNickName').isEmpty().withMessage('should not contain userNickName'),
        check('content').notEmpty().withMessage('content should not be empty').trim().escape(), 
        check('postID').notEmpty().isLength({min : 24, max :24}).withMessage('postID should not be empty and 24 hex characters')
    ],
    checkValidationResult,
    communityController.updatePosts);

router.delete('/:postID',     
    check('postID').notEmpty().isLength({min : 24, max :24}).withMessage('postID should not be empty and 24 hex characters'),
    checkValidationResult,
    communityController.deletePosts);

module.exports = router;