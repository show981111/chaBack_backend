const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const placeController = require('../controllers/place.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');
const placeModel = require('../model/place.js');

//region, category, bathroom, water , price ,from
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:before/:option/', 
    placeModel.placeCommonFilterSchema,
    placeModel.placeFilterSchema,
    checkValidationResult,
    placeController.getPlaceList(false) );
    //get image by place/:placeID/1 
    
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:before/distance/:lat/:lng', 
    placeModel.placeCommonFilterSchema,
    check('before').isNumeric().notEmpty().withMessage('before should be number').trim(),
    check('lat').isDecimal().notEmpty().isFloat({min : -90, max : 90}).withMessage('lat should be decimal').trim(),
    check('lng').isDecimal().notEmpty().isFloat({min : -180, max : 180}).withMessage('lng should be decimal').trim(),
    checkValidationResult,
    placeController.getPlaceList(true) );
    //get image by place/:placeID/1 


router.post('/', //기존 차박지와 간격 500m 차이나는지 확인할것 
    placeModel.placeSchema(false), 
    checkValidationResult,
    jwt.verifyToken(), 
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
    checkValidationResult, 
    jwt.verifyToken(), 
    placeController.deletePlace
);

/**
 * 삭제하면 이미지 삭제도 같이 해주기
 */
module.exports = router;
