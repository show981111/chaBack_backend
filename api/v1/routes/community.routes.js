const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const communityController = require('../controllers/community.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js')
const resourcesController = require('../controllers/resources.controller.js');
const communitySchema = require('../model/community.js');

router.get('/user/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    communityController.unLoginedUser,
    communityController.getCommunityByUserID);

router.get('/:category/:pageNumber', 
    check('category').notEmpty().isFloat({min : 0, max : 1}).withMessage('category should not be empty').trim().toInt(),
    check('pageNumber').notEmpty().isNumeric().withMessage('pageNumber should not be empty').trim().toInt(),
    checkValidationResult,
    jwt.verifyToken(),
    communityController.unLoginedUser,
    communityController.getCommunities);

router.get('/:communityID',
    check('communityID').notEmpty().isNumeric().withMessage('communityID should not be empty').trim(),
    checkValidationResult,
    communityController.getCommunityInfo);

router.post('/board', 
    communitySchema(false),
    checkValidationResult,
    jwt.verifyToken(),
    communityController.postCommunity);

router.put('/:communityID', 
    check('communityID').notEmpty().isNumeric().withMessage('communityID should not be empty').trim(),
    communitySchema(true),
    checkValidationResult,
    jwt.verifyToken(),
    communityController.updateCommunity);

router.delete('/:communityID',     
    check('communityID').notEmpty().isNumeric().withMessage('communityID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    communityController.deleteCommunity,
    resourcesController.deleteObjects
    );

module.exports = router;