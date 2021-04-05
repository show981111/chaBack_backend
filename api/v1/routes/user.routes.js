const express = require('express')
var router = express.Router()
const checkValidationResult = require('../middleware/checkValidationResult');
const userController = require('../controllers/user.controller.js');
const {check, validationResult} = require('express-validator');
const jwt = require('../middleware/jwt.js');


/*로그인 => 토큰 발급*/
router.post('/login',
    check('userID').notEmpty().isEmail().withMessage('userID should be an Email and not Empty').trim(),
    check('userPassword').notEmpty().withMessage('userPassword should not empty'),
    checkValidationResult,
    userController.login)

// /*관리자 로그인 => 토큰 발급*/
// router.post('/admin/login',
//     check('userID').notEmpty().isEmail().withMessage('userID should be an Email and not Empty').trim(),
//     check('userPassword').notEmpty().withMessage('userPassword should not empty'),
//     checkValidationResult,
//     userController.adminLogin)


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
    check('userNickName').notEmpty().withMessage('userNickName should not be Empty').trim(),
    check('userPhone').notEmpty().isNumeric().isLength({min : 11, max :11}).withMessage('userPhone should be an number and not be Empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    userController.updateUserInfo
)
/*비밀번호 변경*/
router.put('/reset',
    check('userID').notEmpty().isEmail().withMessage('userID should not be Empty and be email').trim(),
    check('userPassword').notEmpty().withMessage('userPassword should not be Empty'),
    checkValidationResult,
    userController.resetPassword
)
/*베스트 유저 겟 */
router.get('/best/:page/:parseNum',
    check('page').notEmpty().isNumeric().withMessage('page should be number and not be empty').trim(),
    check('parseNum').notEmpty().isNumeric().withMessage('parseNum should be number and not be empty').trim(),
    checkValidationResult,
    userController.getBest
)

router.post('/report/community/',
    check('id').notEmpty().isNumeric().withMessage('id should be number and not be empty').trim(),
    check('userID').notEmpty().isEmail().withMessage('userID should be number and not be empty').trim(),
    checkValidationResult,
    jwt.verifyToken(),
    userController.postReport('community')
)

module.exports = router;


