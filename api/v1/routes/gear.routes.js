const express = require('express');
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router();
const jwt = require('../middleware/jwt.js');
const gearController = require('../controllers/gear.controller.js');
const resourcesController = require('../controllers/resources.controller.js');
const gearModel = require('../model/gear.js');
const {check} = require('express-validator');


router.post('/',
    gearModel.gearSchema,
    checkValidationResult,
    jwt.verifyToken(),
    gearController.postGear
)

router.put('/:gearID',
    gearModel.gearSchema,
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    gearController.putGear
)

router.delete('/:gearID',
    check('gearID').notEmpty().isNumeric().withMessage('gearID should not be empty').trim(),
    check('imageKey').optional().isArray().withMessage('imageKey should not be empty'),
    checkValidationResult,
    jwt.verifyToken(),
    resourcesController.deleteObjects,
    gearController.deleteGear
)

router.get('/:page',
    check('page').notEmpty().isNumeric().withMessage('page should not be empty').trim(),
    checkValidationResult,
    gearController.getGear
)


module.exports = router;