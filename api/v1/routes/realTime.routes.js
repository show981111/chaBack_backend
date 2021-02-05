const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();const realTimeController = require('../controllers/realTime.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js')
const resourcesController = require('../controllers/resources.controller.js');
const realTimeSchema = require('../model/realTime.js');


router.post('/',
    realTimeSchema,
    checkValidationResult,
    jwt.verifyToken(),
    realTimeController.postRealTime
)

router.put('/:realTimeID',
    check('realTimeID').notEmpty().isNumeric().withMessage('realTimeID should not be empty').trim(),
    check('content').notEmpty().withMessage('content should not be empty').trim().escape(),
    checkValidationResult,
    jwt.verifyToken(),
    realTimeController.putRealTime
)

router.delete('/:realTimeID',
    check('realTimeID').notEmpty().isNumeric().withMessage('realTimeID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    realTimeController.deleteRealTime
)

router.get('/:pageNumber/:parseNum', 
    check('pageNumber').notEmpty().isNumeric().withMessage('pageNumber should not be empty').trim().toInt(),
    check('parseNum').notEmpty().isNumeric().withMessage('parseNum should not be empty').trim().toInt(),
    checkValidationResult,
    realTimeController.getAllRealTime
);

router.get('/place/:placeID/:pageNumber/:parseNum', 
    check('pageNumber').notEmpty().isNumeric().withMessage('pageNumber should not be empty').trim().toInt(),
    check('placeID').notEmpty().isNumeric().withMessage('placeID should not be empty').trim().toInt(),
    check('parseNum').notEmpty().isNumeric().withMessage('parseNum should not be empty').trim().toInt(),
    checkValidationResult,
    realTimeController.getRealTimeByPlaceID
);

module.exports = router;