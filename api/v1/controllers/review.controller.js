const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
const makeImageKey = require('../utils/makeImageKey.js');
const buildQuery = require('../utils/getReviewQueryBuilder.js');
const makeImageArray = require('../utils/makeImageArray.js');
let unLoginedUser = function(err, req, res, next){
    if(err.status == 401 && err.message == 'no credential'){
        next();
    }else{
        next(err);
    } 
}
/**
 * @param {string} option 
 */
let getReview = function(option, parseNum = 20){
    return function(req, res, next) {
        var query = buildQuery(req.token_userID, option, req.params, parseNum);

        db.query(query.sql, query.params, function(err, results) {
            if(err) {
                console.log(err);
                return next(err);
            }
            console.log(this.sql);
            // if(option != 'userID')
            // {
            results = makeImageArray(results, 'review');
            res.status(200).send(results);
        })
    }
}

let updateUserInfo = function(userID, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE USER SET reviewCount = reviewCount + 1 WHERE userID = ?';
    }else{
        sql = 'UPDATE USER SET reviewCount = reviewCount - 1 WHERE userID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [userID], function(err, results) {
            if(err){ 
                console.log(err);
                return reject(err);
            }
            if(results.affectedRows > 0){
                resolve();
            }else{
                const e = new Error('Not Found');
                e.status = 404;
                reject(e);
            }
        })
    });
}


/**
 * @param {Number} placeID 
 * @param {Number} point 
 * @param {string} option 
 */
let updatePlaceInfo = function(placeID, point, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE PLACE SET totalPoint = totalPoint + ?, reviewCount = reviewCount + 1 WHERE placeID = ?';
    }else if(option == 'update'){// point = curPoint - pastPoint
        sql = 'UPDATE PLACE SET totalPoint = totalPoint + ? WHERE placeID = ?';
    }else if(option == 'delete'){
        sql = 'UPDATE PLACE SET totalPoint = totalPoint - ?, reviewCount = reviewCount - 1 WHERE placeID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [point, placeID], function(err, results) {
            if(err) reject(err);
            if(results.affectedRows > 0){
                resolve();
            }else{
                const e = new Error('Not Found');
                e.status = 404;
                reject(e);
            }
        })
    });
}

let postReview = function (req, res, next) {
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    console.log(req.body.imageKey);
    var imageKeyWithComma = makeImageKey(req.body.imageKey);
    console.log(imageKeyWithComma);
    const sql = `INSERT INTO REVIEW(FK_REVIEW_placeID, content, updated, FK_REVIEW_userID, point, imageKey)
                    VALUES(?,?,?,?,?,?)`;
    const params = [req.body.placeID, req.body.content,updated, req.token_userID, req.body.point, imageKeyWithComma];
    db.query(sql, params, async function (err, results) {
        if(err) {
            console.log(err);
            if(err.errno == 1452){
                const e = new Error('placeID Not Found');
                e.status = 404;
                return next(e);
            }
            return next(err);
        }

        if(results.affectedRows > 0){
            try{
                await updatePlaceInfo(req.body.placeID, req.body.point, 'insert');
                await updateUserInfo(req.token_userID, 'insert');
                res.status(200).send({ reviewID : results.insertId });
            }catch(err){
                return next(err);
            }
        }else{
            next(new Error());
        }
    })
}

let putReview = function (req, res, next) {
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    const sql = `UPDATE REVIEW SET content = ?, updated = ?, point = ?, imageKey = ?
                    WHERE FK_REVIEW_userID = ? AND reviewID = ? AND FK_REVIEW_placeID = ?`;
    const params = [req.body.content, updated, req.body.point, imageKeyWithComma, req.token_userID, req.params.reviewID
                        ,req.params.placeID ];
    db.query(sql, params, async function (err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            try{
                await updatePlaceInfo(req.params.placeID, req.body.pointGap, 'update');
                res.status(200).send('success');
            } catch(err){
                return next(err);
            }
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}

let deleteReview = function (req, res, next) {
    var sql = 'DELETE FROM REVIEW WHERE FK_REVIEW_userID = ? AND reviewID = ? RETURNING point, FK_REVIEW_placeID, imageKey, FK_REVIEW_userID';
    var params = [req.token_userID, req.params.reviewID];

    if(req.isAdmin){
        sql = 'DELETE FROM REVIEW WHERE reviewID = ? RETURNING point, FK_REVIEW_placeID, imageKey, FK_REVIEW_userID';
        params = [req.params.reviewID];
    }
    db.query(sql, params, async function(err, results) {
        if(err) {console.log(err); return next(err);}
        console.log(results);
        if(results.length > 0 && results[0].point !== undefined){
            console.log(results[0].point);
            try{
                await updatePlaceInfo(results[0].FK_REVIEW_placeID, results[0].point, 'delete');
                req.token_userID = results[0].FK_REVIEW_userID;
                if(results[0].imageKey) {
                    req.body.imageKey = results[0].imageKey.split(',');
                }
                if(!req.isAdmin)
                {
                    await updateUserInfo(req.token_userID, 'delete');
                }
                next();
            } catch(err){
                return next(err);
            }
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        } 
    })
}


module.exports = {
    getReview : getReview,
    postReview : postReview,
    putReview : putReview,
    deleteReview : deleteReview,
    unLoginedUser : unLoginedUser
}