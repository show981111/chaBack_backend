const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const jwt = require('../middleware/jwt.js');
const gearController = require('../controllers/gear.controller.js');
const gearModel = require('../model/gear.js');
const {check} = require('express-validator');


router.post('/',
    gearModel.gearSchema,
    checkValidationResult,
    jwt.adminVerification,
    gearController.postGear
)

router.put('/:gearID',
    gearModel.gearSchema,
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    checkValidationResult,
    jwt.adminVerification,
    gearController.putGear
)

router.delete('/:gearID',
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    checkValidationResult,
    jwt.adminVerification,
    gearController.deleteGear
)

router.get('/',
    jwt.verifyToken(),
    gearController.getGear
)


module.exports = router;