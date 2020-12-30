const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const placeController = require('../controllers/place.controller.js');
const {check, validationResult, checkSchema} = require('express-validator');
const jwt = require('../middleware/jwt.js');
const placeModel = require('../model/place.js');

router.get('/place', placeController. );
router.get('/place/category/:category', 
    check('category').notEmpty().custom((value) => {
        try{
            placeModel.filter(value, placeModel.categoryList);
        }catch(err){
            throw err;
        }
    }).trim(),
    placeController. );
router.get('/place/region/:region', 
    check('region').notEmpty().custom((value) => {
        try{
            placeModel.filter(value, placeModel.regionData);
        }catch(err){
            throw err;
        }
    }).trim(),
    placeController. );


// router.post('/place', //기존 차박지와 간격 500m 차이나는지 확인할것 
//     placeModel.placeSchema, 
//     jwt.verifyToken(), 
//     placeController. 
// );

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
