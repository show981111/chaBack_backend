const express = require('express')
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const wishController = require('../controllers/wish.controller.js');
const {check, validationResult} = require('express-validator');
const checkValidationResult = require('../middleware/checkValidationResult');

//req.body.userID, req.body.id
router.post('/:placeID',
    check('placeID').notEmpty().isNumeric().withMessage('id should not be empty and be a number'),
    checkValidationResult,
    jwt.verifyToken(),
    wishController.postWish
);

router.delete('/:placeID',
    check('placeID').notEmpty().isNumeric().withMessage('id should not be empty and be a number'),
    checkValidationResult,  
    jwt.verifyToken(),
    wishController.deleteWish
);

router.get('/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should not be empty and be an email'),
    checkValidationResult,  
    wishController.getWish
)

module.exports = router;