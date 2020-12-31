const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const placeController = require('../controllers/place.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');
const placeModel = require('../model/place.js');

//region, category, bathroom, water , price ,from
router.get('/:region/:category/:bathroom/:water/:price/:before', 
    placeModel.placeFilterSchema,
    checkValidationResult,
    placeController.getPlaceList );
    //get image by place/:placeID/1 

router.post('/place', //기존 차박지와 간격 500m 차이나는지 확인할것 
    placeModel.placeSchema, 
    jwt.verifyToken(), 
    placeController. postPlace
    //, upload images to AWS S3
);

// router.put('/place/:placeID',
//     check('placeID').notEmpty().isNumeric().withMessage('placeID should be number and not be empty').trim(),
//     placeSchema, 
//     jwt.verifyToken(), 
//     placeController. 
// );

// router.put('/place/:placeID',
//     check('placeID').notEmpty().isNumeric().withMessage('placeID should be number and not be empty').trim(),
//     placeSchema, 
//     jwt.verifyToken(), 
//     placeController. 
// );

module.exports = router;
