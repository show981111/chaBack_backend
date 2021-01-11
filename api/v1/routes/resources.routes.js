const express = require('express')
var router = express.Router()
const resourcesController = require('../controllers/resources.controller.js');
const jwt = require('../middleware/jwt.js');



router.post('/upload', 
    jwt.verifyToken(), 
    resourcesController.upload.array('img' , 10) ,
    (req, res, next) => {
        console.log(req.files)
        res.status(200).send('success');
    }
)

router.post('/profile/upload', 
    jwt.verifyToken(), 
    resourcesController.profileUpload.array('img' , 1) ,
    (req, res, next) => {
        console.log(req.files)
        res.status(200).send('success');
    }
)

module.exports = router;