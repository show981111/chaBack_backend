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
    reviewController.unLoginedUser,
    reviewController.getReview('placeID')
)
/*리뷰 최신순에 따라서 얻기 */
router.get('/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.unLoginedUser,
    reviewController.getReview())

/*리뷰 좋아요 수에 따라서 얻기 */
router.get('/like/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.unLoginedUser,
    reviewController.getReview('like'))

/*리뷰 전체 랭킹 상위 5개*/
router.get('/rank/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.unLoginedUser,
    reviewController.getReview('rank', 5))

/*각 차박지의 베스트리뷰 5개*/
router.get('/best/:placeID/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.unLoginedUser,
    reviewController.getReview('best', 5))

/*리뷰 유저아이디에 따라서 얻기 */
router.get('/user/:userID/:page', 
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    check('userID').isEmail().notEmpty().withMessage('userID should be email and not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.unLoginedUser,
    reviewController.getReview('userID'))



/*리뷰 수정 */
router.put('/:reviewID',
    reviewModel.reviewSchema(true),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.putReview
)

router.delete('/:reviewID',
    check('reviewID').isNumeric().notEmpty().withMessage('reviewID should be number').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    reviewController.deleteReview,
    resourcesController.deleteObjects,
)

module.exports = router;