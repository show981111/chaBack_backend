const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const placeController = require('../controllers/place.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');
const placeModel = require('../model/place.js');
const resourcesController = require('../controllers/resources.controller.js');


//region, category, bathroom, water , price ,from
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:page/:option/', 
    placeModel.placeCommonFilterSchema,
    placeModel.placeFilterSchema,
    checkValidationResult,
    placeController.getPlaceList(false) );
    //get image by place/:placeID/1 
    
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:page/distance/:lat/:lng', 
    placeModel.placeCommonFilterSchema,
    check('page').isNumeric().notEmpty().withMessage('page should be number').trim(),
    check('lat').isDecimal().notEmpty().isFloat({min : -90, max : 90}).withMessage('lat should be decimal').trim(),
    check('lng').isDecimal().notEmpty().isFloat({min : -180, max : 180}).withMessage('lng should be decimal').trim(),
    checkValidationResult,
    placeController.getPlaceList(true) );
    //get image by place/:placeID/1 


router.post('/', //기존 차박지와 간격 500m 차이나는지 확인할것 
    jwt.verifyToken(), 
    placeModel.placeSchema(false), 
    checkValidationResult,
    placeController.postPlace
    //, upload images to AWS S3
);

/*정보 수정 */
// [req.body.placeName, req.body.content,req.body.category,
//     req.body.bathroom,req.body.water,req.body.price,req.body.point ,req.params.placeID];
router.put('/:placeID',
    placeModel.placeSchema(true), 
    checkValidationResult,
    jwt.verifyToken(), 
    placeController.putPlace
);

/*place 삭제 */
router.delete('/:placeID',
    check('placeID').notEmpty().isNumeric().withMessage('placeID should be number and not be empty').trim(),
    check('imageKey').optional().notEmpty().isArray().withMessage('imageKey should not be empty'),
    checkValidationResult, 
    jwt.verifyToken(), 
    resourcesController.deleteObjects,
    placeController.deletePlace
);

/**
 * 조회수 UP
 */

// router.put('/view/:placeID',
//     check('placeID').notEmpty().isNumeric().withMessage('placeID should be number and not be empty').trim(),
//     checkValidationResult, 
//     placeController.updateViewCount
//     )

/*차박지 아이디를 통해서 차박지 정보 가져옴 + 조회수 업*/
router.get('/:placeID', 
    check('placeID').notEmpty().isNumeric().withMessage('placeID should be number and not be empty').trim(),
    checkValidationResult, 
    placeController.getPlaceInfoByID
    )

/*베스트 차박지 가져옴 */
router.get('/best/:page/:parseNum', 
    check('page').notEmpty().isNumeric().withMessage('page should be number and not be empty').trim(),
    check('parseNum').notEmpty().isNumeric().withMessage('parseNum should be number and not be empty').trim(),
    checkValidationResult, 
    placeController.getBest
    )
module.exports = router;
