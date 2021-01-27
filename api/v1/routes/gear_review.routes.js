const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const gearReviewController = require('../controllers/gear_review.controller.js');
const {check, validationResult} = require('express-validator');
const gearReviewModel = require('../model/gear_review.js');
const jwt = require('../middleware/jwt.js');

router.post('/',
    gearReviewModel(false),
    checkValidationResult,
    jwt.verifyToken(),
    gearReviewController.postGearReview
)

router.put('/:gearReviewID',
    check('gearReviewID').notEmpty().isNumeric().withMessage('gearReviewID should not be empty').trim(),
    gearReviewModel(true),
    checkValidationResult,
    jwt.verifyToken(),
    gearReviewController.putGearReview
)

router.delete('/:gearID/:gearReviewID/:point',
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    check('gearReviewID').notEmpty().isNumeric().withMessage('gearReviewID should not be empty').trim(),
    check('point').notEmpty().isNumeric().withMessage('point should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    gearReviewController.deleteGearReview
)

router.get('/gear/:gearID',
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    gearReviewController.getGearReview('gearID')
)

router.get('/user/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    gearReviewController.getGearReview('userID')
)

module.exports = router;