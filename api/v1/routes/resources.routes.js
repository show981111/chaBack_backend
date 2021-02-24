const express = require('express')
var router = express.Router()
const resourcesController = require('../controllers/resources.controller.js');
const checkValidationResult = require('../middleware/checkValidationResult');
const {check} = require('express-validator');
const jwt = require('../middleware/jwt.js');



router.post('/upload',
    jwt.verifyToken(), 
    resourcesController.upload.array('img' , 5) ,
    (req, res, next) => {
        res.status(200).send('success');
    }
)

router.put('/profile', 
    jwt.verifyToken(), 
    resourcesController.profileUpload.array('img' , 1) ,
    resourcesController.updateProfile
)

router.delete('/', 
    check('imageKey').notEmpty().isArray().withMessage('key should not be empty'),
    checkValidationResult,
    jwt.verifyToken(), 
    resourcesController.deleteObjects
)

// router.get('/original/:endPoint/:id/:key', 
//     check('endPoint').notEmpty().withMessage('endPoint should not be empty').trim(),
//     check('id').notEmpty().withMessage('id should not be empty').trim(),
//     check('key').notEmpty().withMessage('key should not be empty').trim(),
//     checkValidationResult,
//     resourcesController.downloadImage('original')
// )

// router.get('/resize/:endPoint/:id/:key', 
//     check('endPoint').notEmpty().withMessage('endPoint should not be empty').trim(),
//     check('id').notEmpty().withMessage('id should not be empty').trim(),
//     check('key').notEmpty().withMessage('key should not be empty').trim(),
//     checkValidationResult,
//     resourcesController.downloadImage('resize')
// )

// router.get('/original/profile/:userID', 
//     check('userID').notEmpty().isEmail().withMessage('userID should not be empty').trim(),
//     resourcesController.downloadImage('prof_org')
// )

// router.get('/resize/profile/:userID', 
//     check('userID').notEmpty().isEmail().withMessage('userID should not be empty').trim(),
//     resourcesController.downloadImage('prof_res')
// )

module.exports = router;