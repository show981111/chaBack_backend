const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
require('dotenv').config();
const sharp = require("sharp");
const AWS = require('aws-sdk');
var multer  = require('multer');
// const multerS3 = require('multer-s3');
const multerS3 = require("multer-s3-transform");
AWS.config.update({
    secretAccessKey: process.env.IAM_USER_SECRET,
    accessKeyId: process.env.IAM_USER_KEY,
    region: process.env.REGION
});

var s3 = new AWS.S3();


let upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        shouldTransform : function (req, file, cb) {
            console.log('in should transform ', file)
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [
            {
            id: 'original',
            key: function (req, file, cb) {
                if(req.body.path == undefined || !req.body.path.trim() ){
                    const e = new Error('path is required');
                    e.status = 400;
                    return cb(e);
                }
                req.body.path = req.body.path.trim();
                var keyName = file.originalname.split(".")[0];
                cb(null, `images/${req.body.path}/original/${keyName}.jpeg`); 
            },
            transform: function (req, file, cb) {
              cb(null, sharp().rotate().jpeg())
            }
          }, 
          {
            id: 'thumbnail',
            key: function (req, file, cb) {
                if(req.body.path == undefined || !req.body.path.trim() ){
                    const e = new Error('path is required');
                    e.status = 400;
                    return cb(e);
                }
                req.body.path = req.body.path.trim();
                var keyName = file.originalname.split(".")[0];
                cb(null, `images/${req.body.path}/resize/${keyName}.jpeg`); 
            },
            transform: function (req, file, cb) {
              cb(null, sharp().rotate().resize({
                    fit: sharp.fit.contain,
                    width: 100
                }).jpeg())
            }
          }
        ]
    })
});


let profileUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        shouldTransform : function (req, file, cb) {
            console.log('in should transform ', file)
            cb(null, /^image/i.test(file.mimetype))
        },
        transforms: [
            {
            id: 'original',
            key: function (req, file, cb) {
                if(req.token_userID == undefined){
                    const e = new Error('authentication needed');
                    e.status = 401;
                    return cb(e);
                }
                const imagePath = `images/profile/original/${req.token_userID}.jpeg`;
                cb(null, imagePath); //use Date.now() for unique file keys
            },
            transform: function (req, file, cb) {
              cb(null, sharp().rotate().jpeg())
            }
          }, 
          {
            id: 'thumbnail',
            key: function (req, file, cb) {
                if(req.token_userID == undefined){
                    const e = new Error('authentication needed');
                    e.status = 401;
                    return cb(e);
                }
                const imagePath = `images/profile/resize/${req.token_userID}.jpeg`;
                cb(null, imagePath); //use Date.now() for unique file keys
            },
            transform: function (req, file, cb) {
              cb(null, sharp().rotate().resize({
                    fit: sharp.fit.contain,
                    width: 100
                }).jpeg())
            }
          }
        ]
    })
});

module.exports = {
    upload : upload,
    profileUpload : profileUpload
}