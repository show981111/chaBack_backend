const express = require('express')
var router = express.Router()
const resourcesController = require('../controllers/resources.controller.js');
const checkValidationResult = require('../middleware/checkValidationResult');
const {check} = require('express-validator');
const jwt = require('../middleware/jwt.js');



router.post('/upload', // body 에 path 담아줄 필요가 있음 
    jwt.verifyToken(), 
    resourcesController.upload.array('img' , 10) ,
    (req, res, next) => {
        console.log(req.files)
        res.status(200).send('success');
    }
)

router.post('/profile/upload', 
    jwt.verifyToken(), 
    resourcesController.updateProfile,
    resourcesController.profileUpload.array('img' , 1) ,
    (req, res, next) => {
        console.log(req.files)
        res.status(200).send('success');
    }
)

router.get('/original/:endPoint/:id/:key', 
    check('endPoint').notEmpty().withMessage('endPoint should not be empty').trim(),
    check('id').notEmpty().withMessage('id should not be empty').trim(),
    check('key').notEmpty().withMessage('key should not be empty').trim(),
    checkValidationResult,
    resourcesController.downloadImage('original')
)

router.get('/resize/:endPoint/:id/:key', 
    check('endPoint').notEmpty().withMessage('endPoint should not be empty').trim(),
    check('id').notEmpty().withMessage('id should not be empty').trim(),
    check('key').notEmpty().withMessage('key should not be empty').trim(),
    checkValidationResult,
    resourcesController.downloadImage('resize')
)

router.delete('/:endPoint/:id/:key', 
    check('endPoint').notEmpty().withMessage('endPoint should not be empty').trim(),
    check('id').notEmpty().withMessage('id should not be empty').trim(),
    check('key').notEmpty().withMessage('key should not be empty').trim(),
    checkValidationResult,
    resourcesController.deleteObjects
)
module.exports = router;