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
                if(req.body.path == undefined || !req.body.path.trim() || req.body.path.split("/").length < 2 ){
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
                if(req.body.path == undefined || !req.body.path.trim() || req.body.path.split("/").length < 2){
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
                if(!req.token_userID){
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
                if(!req.token_userID){
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

let updateProfile = function(req, res, next){
    const sql = 'UPDATE USER SET profileImg = 1 WHERE userID = ?';
    db.query(sql, [req.token_userID], async function (err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            next();
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}

/**
 * 
 * @param {string} option 
 */
let downloadImage = function(option){
    return function(req, res, next){
        var path;
        var fileName;
        if(option == 'original'){
            path = `images/${req.params.endPoint}/${req.params.id}/original/${req.params.key}`
            fileName = req.params.key;
        }else if(option == 'prof_org'){
            path = `images/profile/original/${req.params.userID}.jpeg`
            fileName = `${req.params.userID}.jpeg`;
        }else if(option == 'prof_res'){
            path = `images/profile/resize/${req.params.userID}.jpeg`
            fileName = `${req.params.userID}.jpeg`;
        }else{
            path = `images/${req.params.endPoint}/${req.params.id}/resize/${req.params.key}`
            fileName = req.params.key;
        }
        console.log(path);
        var params = {
        Bucket : process.env.BUCKET_NAME,
        Key : path
        }
        s3.getObject(params, function (err, data) {
            if (err) {
                console.log(err);
                if(err.code == 'NoSuchKey'){
                    const e= new Error('The specified key does not exist')
                    e.status = 404;
                    return next(e);
                }
                return next(err);
            } else {
                res.setHeader('Content-disposition', 'attachment: filename='+fileName);
                res.setHeader('Content-length', data.ContentLength);
                res.end(data.Body);
            }
        });
    }
}

let deleteObjects = function(req, res, next){
    var deleteKeys = [];
    console.log(req.body.key);
    for(var i = 0; i < req.body.key.length; i++){
        deleteKeys.push(
            {
                Key: `images/${req.params.endPoint}/${req.params.id}/original/${req.body.key[i]}` 
            },
            {
                Key: `images/${req.params.endPoint}/${req.params.id}/resize/${req.body.key[i]}` 
            },
        )
    }
    var params = {
        Bucket: process.env.BUCKET_NAME, 
        Delete: {
         Objects: deleteKeys,
         Quiet: false
        }
       };
       s3.deleteObjects(params, function(err, data) {
            if (err) {
                console.log(err); 
                if(err.code == 'NoSuchKey'){
                    const e= new Error('The specified key does not exist')
                    e.status = 404;
                    return next(e);
                }
                return next(err)
            } // an error occurred
            else {
                console.log(data);
                res.status(200).send('success');
            }    
       });
}
module.exports = {
    upload : upload,
    profileUpload : profileUpload,
    updateProfile : updateProfile,
    downloadImage : downloadImage,
    deleteObjects : deleteObjects
}