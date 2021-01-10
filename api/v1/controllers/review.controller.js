const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
const makeImageKey = require('../utils/makeImageKey.js');

/**
 * @param {string} option 
 */
let getReview = function(option){
    return function(req, res, next) {
        var sql;
        var params = [];
        if(option === 'placeID'){
            sql = 'SELECT * FROM REVIEW WHERE FK_REVIEW_placeID = ? AND reviewID < ? order by reviewID DESC LIMIT 20';
            params.push(req.params.placeID);
        }else if(option === 'userID'){
            sql = 'SELECT * FROM REVIEW WHERE FK_REVIEW_userID = ? AND reviewID < ? order by reviewID DESC LIMIT 20';
            params.push(req.params.userID);
        }else{
            sql = 'SELECT * FROM REVIEW WHERE reviewID < ? order by reviewID DESC LIMIT 20';
        }
        params.push(req.params.before);
        db.query(sql, params, function(err, results) {
            if(err) {
                console.log(err);
                return next(err);
            }
            res.status(200).send(results);
        })
    }
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
    const sql = 'DELETE FROM REVIEW WHERE FK_REVIEW_userID = ? AND reviewID = ? AND FK_REVIEW_placeID = ?';
    db.query(sql, [req.token_userID, req.params.reviewID, req.params.placeID], async function(err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            try{
                await updatePlaceInfo(req.params.placeID, 0, 'delete');
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

module.exports = {
    getReview : getReview,
    postReview : postReview,
    putReview : putReview,
    deleteReview : deleteReview
}