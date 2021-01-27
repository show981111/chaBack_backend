const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const reviewController = require('../controllers/review.controller.js');
const {check, validationResult} = require('express-validator');
const reviewModel = require('../model/review.js');
const jwt = require('../middleware/jwt.js');
const resourcesController = require('../controllers/resources.controller.js');

/*리뷰 등록 */
router.post('/',
    reviewModel.reviewSchema(false),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.postReview
)

/*리뷰 placeID에 따라서 얻기 */
router.get('/place/:placeID/:page',
    check('placeID').isNumeric().notEmpty().withMessage('placeID should be number').trim(),
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.getReview('placeID')
)
/*리뷰 최신순에 따라서 얻기 */
router.get('/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.getReview())

/*리뷰 좋아요 수에 따라서 얻기 */
router.get('/like/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.getReview('like'))

/*리뷰 유저아이디에 따라서 얻기 */
router.get('/user/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.getReview('userID'))



/*리뷰 수정 */
router.put('/:reviewID/:placeID',
    reviewModel.reviewSchema(true),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.putReview
)

router.delete('/:reviewID/:placeID',
    check('reviewID').isNumeric().notEmpty().withMessage('reviewID should be number').trim(),
    check('placeID').isNumeric().notEmpty().withMessage('placeID should be number').trim(),
    check('imageKey').notEmpty().isArray().withMessage('imageKey should not be empty'),
    checkValidationResult,
    jwt.verifyToken(),
    resourcesController.deleteObjects,
    reviewController.deleteReview
)

module.exports = router;