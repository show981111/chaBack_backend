const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const placeController = require('../controllers/place.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');
const placeModel = require('../model/place.js');
const { options } = require('superagent');

//region, category, bathroom, water , price ,from
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:before/:option/', 
    placeModel.placeFilterSchema,
    checkValidationResult,
    placeController.getPlaceList );
    //get image by place/:placeID/1 
    
router.get('/:region/:category/:bathroom/:water/:price/:placeName/:before/:option/:lat/:lng', 
    placeModel.placeFilterSchema,
    checkValidationResult,
    placeController.getPlaceList );
    //get image by place/:placeID/1 


router.post('/', //기존 차박지와 간격 500m 차이나는지 확인할것 
    check('imageKey').notEmpty().isLength({max :300}).withMessage('imageKey should not be number and max 300 chars').trim(),
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
    placeModel.placeSchema, 
    jwt.verifyToken(), 
    placeController.deletePlace
);

/**
 * 사용자 위치기반으로 겟하는거 위의 겟에다가 사용자 위치 받는거만 추가해주면 된다잉
 * 이름기준으로 서치하는거(위의 겟에 이름만 추가)
 */
module.exports = router;
