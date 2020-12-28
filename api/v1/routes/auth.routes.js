const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const authController = require('../controllers/auth.controller.js');
const {check, validationResult} = require('express-validator');


/**Send Email to User */
router.post('/email/verify',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
    checkValidationResult,
    authController.postEmail
);

/**Verify  User : get userID from token and post or put into verification table*/
router.post('/email/verify/:token',
    authController.
);

/**Auto login Using jwt : validate accesstoken and send userInfo */
router.get('/login',
    jwt.verifyToken,
    authController.
);

/**Get new accesstoken using refreshToken : compare refreshTokin in DB and verify token then issue new AccessToken to User*/
router.get('/refresh/:userID',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty'),
    checkValidationResult,
    authController.
);


module.exports = router;