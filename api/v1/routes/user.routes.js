const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const userController = require('../controllers/user.controller.js');
const {check, validationResult} = require('express-validator');


/*로그인 => 토큰 발급*/
router.post('/login',
    check('userID').notEmpty().isEmail().withMessage('userID should be an Email and not Empty').trim(),
    check('userPassword').notEmpty().withMessage('userPassword should not empty'),
    checkValidationResult,
    userController.login)
/*회원가입*/
router.post('/register',
    check('userID').notEmpty().isEmail().withMessage('userID should be an Email and not be Empty').trim(),
    check('userPassword').notEmpty().withMessage('userPassword should not be empty'),
    check('userNickName').notEmpty().withMessage('userNickName should not be Empty').trim(),
    check('userName').notEmpty().withMessage('userName should not be empty').trim(),
    check('userPhone').notEmpty().isNumeric().isLength({min : 11, max :11}).withMessage('userPhone should be an number and not be Empty'),
    checkValidationResult,
    userController.register)

/*회원 정보 수정*/
router.put('/',
    check('userID').notEmpty().isEmail().withMessage('userID should not be Empty and be email').trim(),
    check('profileImg').notEmpty().withMessage('profileImg should not be Empty').trim(),
    check('userNickName').notEmpty().withMessage('userNickName should not be Empty').trim(),
    check('userName').notEmpty().withMessage('userName should not be empty').trim(),
    check('userPhone').notEmpty().isNumeric().isLength({min : 11, max :11}).withMessage('userPhone should be an number and not be Empty').trim(),
    checkValidationResult,
    userController.updateUserInfo
)
/*비밀번호 변경*/
router.put('/reset',
    check('userID').notEmpty().isEmail().withMessage('userID should not be Empty and be email').trim(),
    check('userPassword').notEmpty().withMessage('userPassword should not be Empty'),
    checkValidationResult,
    userController.resetPassword
)


module.exports = router;