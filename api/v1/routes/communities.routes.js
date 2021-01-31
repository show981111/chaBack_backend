const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const communityController = require('../controllers/communities.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js')
const resourcesController = require('../controllers/resources.controller.js');
const communitySchema = require('../model/communities.check.js');

router.get('/', communityController.getAllPosts);

router.get('/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty').trim(),
    checkValidationResult,
    communityController.getPostsByID);

router.post('/', communitySchema,
    checkValidationResult,
    jwt.verifyToken(),
    communityController.postPosts);

router.put('/:postID',
    [
        check('userNickName').isEmpty().withMessage('should not contain userNickName').trim(),
        check('content').notEmpty().withMessage('content should not be empty').trim().escape(), 
        check('postID').notEmpty().isLength({min : 24, max :24}).withMessage('postID should not be empty and 24 hex characters').trim()
    ],
    checkValidationResult,
    jwt.verifyToken(),
    communityController.updatePosts);

router.delete('/:postID',     
    check('postID').notEmpty().isLength({min : 24, max :24}).withMessage('postID should not be empty and 24 hex characters').trim(),
    check('imageKey').optional().notEmpty().isArray().withMessage('imageKey should not be empty'),
    checkValidationResult,
    jwt.verifyToken(),
    resourcesController.deleteObjects,
    communityController.deletePosts);

module.exports = router;