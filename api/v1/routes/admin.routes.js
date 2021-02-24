const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const resourcesController = require('../controllers/resources.controller.js');
const adminController = require('../controllers/admin.controller.js');
const {check, validationResult} = require('express-validator');


router.delete('/:target/:id',
    check('id').notEmpty().isNumeric().withMessage('id should not be empty').trim(),
    check('target').notEmpty().withMessage('target should not be empty').trim(),
    check('imageKey').optional().isArray().withMessage('imageKey should not be empty'),
    checkValidationResult,
    jwt.verifyToken(),
    adminController.checkAdmin,
    resourcesController.deleteObjects,
    adminController.deleteRow
)


module.exports = router;