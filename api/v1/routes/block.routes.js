const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const blockController = require('../controllers/block.controller.js');
const {check, validationResult} = require('express-validator');

/**Send Email to User */
router.post('/',
    check('blockedUserID').notEmpty().isEmail().withMessage('blockedUserID should be email and not Empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    blockController.postBlockUser
);

router.delete('/:blockedUserID',
    check('blockedUserID').notEmpty().isEmail().withMessage('blockedUserID should be email and not Empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    blockController.deleteBlockUser
);

router.get('/',
    jwt.verifyToken(),
    blockController.getBlockedUser
);

module.exports = router;