const express = require('express')
const checkValidationResult = require('../middleware/checkValidationResult');
var router = express.Router()
const jwt = require('../middleware/jwt.js')
const authController = require('../controllers/auth.controller.js');
const {check, validationResult} = require('express-validator');


/**Send Email to User */
router.post('/email/verify',
    check('userID').notEmpty().isEmail().withMessage('userID should be email and not Empty').trim(),
    checkValidationResult,
    authController.postEmail
);

/**Verify  User : get userID from token and post or put into verification table*/
router.post('/email/verify/:token',
    jwt.verifyEmailVerification,
    authController.verifyUser
);

/**Auto login Using jwt : validate accesstoken and send userInfo */
router.get('/login',
    jwt.verifyToken(),
    authController.authLogin
);

/**Get new accesstoken using refreshToken : compare refreshToken in DB and verify token then issue new AccessToken to User*/
router.post('/refresh/',
    check('refreshToken').notEmpty().isJWT().withMessage('refreshToken should not be Empty').trim(),
    checkValidationResult,
    jwt.verifyToken('refreshToken'),
    authController.issueNewAccessToken
);


module.exports = router;