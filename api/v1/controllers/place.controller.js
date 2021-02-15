const db = require('../../../dbConnection/mariaDB.js');
const queryBuilder = require('../utils/filterQueryBuilder.js');
var Promise = require('promise');
//const placeModel = require('../model/place.js');
const makeImageArray = require('../utils/makeImageArray.js')
const makeImageKey = require('../utils/makeImageKey.js');
require('dotenv').config();

let updateUserInfo = function(userID, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE USER SET placeCount = placeCount + 1 WHERE userID = ?';
    }else{
        sql = 'UPDATE USER SET placeCount = placeCount - 1 WHERE userID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [userID], function(err, results) {
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

/**
 * @param {Boolean} byDistance 
 */
let getPlaceList = function (byDistance) {
    return function(req, res, next){
        var sql;
        if(byDistance === true){
            sql = queryBuilder.filterQueryBuilder(req.params.region, req.params.category, 
                req.params.bathroom, req.params.water, req.params.price, req.params.placeName,
                req.params.page, 'distance', req.params.lat, req.params.lng);
        }else{
            sql = queryBuilder.filterQueryBuilder(req.params.region, req.params.category, 
                req.params.bathroom, req.params.water, req.params.price, req.params.placeName,
                req.params.page, req.params.option, undefined, undefined);
        }
        
        db.query(sql.sql, sql.params, function(err, results) {
            if(err){ console.log(this.sql);return next(err);}
            results = makeImageArray(results, 'place');
            res.status(200).send(results);
        })
    }
}

let calDistance = function(lat, lng, region) {
    var searchInRegion = `SELECT lat, lng, 
                (
                    6371 *
                    acos(cos(radians(?)) * 
                    cos(radians(lat)) * 
                    cos(radians(lng) - 
                    radians(?)) + 
                    sin(radians(?)) * 
                    sin(radians(lat)))
                ) AS distance FROM PLACE WHERE region = ? HAVING distance < 0.5 ORDER BY distance ASC LIMIT 1`
    //var nearRegionArray = placeModel.nearRegion[region];
    return new Promise(function(resolve, reject){
        db.query(searchInRegion, [lat, lng , lat, region], function(err, results) {
            if(err) return reject(err);
            if(results.length > 0){
                const e = new Error('conflicted place');
                e.status = 403;
                reject(e);
            }else{
                resolve();
            }
        })
    })
}

let postPlace = async function(req, res, next) {
    if(req.token_userID == undefined || !req.token_userID){
        const e = new Error('userID is empty');
        e.status = 401;
        return next(e);
    }

    try{
        await calDistance(req.body.lat,req.body.lng, req.body.region);
    }catch(e){
        console.log(e);
        return next(e);
    }

    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    var sql = `INSERT INTO PLACE(placeName, FK_PLACE_userID, updated ,lat, lng, address, region, content, category, bathroom, water, price, imageKey)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    var params = [req.body.placeName, req.token_userID,updated ,req.body.lat, req.body.lng, req.body.address,req.body.region,req.body.content,
                    req.body.category, req.body.bathroom,req.body.water,req.body.price, imageKeyWithComma];
    db.query(sql,params, async function (err, results) {
        if(err){ 
            console.log(err);
            if(err.errno == 1062){
                const error = new Error();
                error.status = 409;
                error.message = 'placeName already exist';
                next(error);
            }else{
                next(err);
            }
            return;
        }
        if(results.affectedRows > 0){
            //next() 해서 aws에 이미지 삽입! 
            try{
                await updateUserInfo(req.token_userID, 'insert');
                res.status(200).send({
                    placeID : results.insertId
                })
            }catch(e){
                return next(e);
            }
        }else{
            next(new Error());
        }
    })
}

let putPlace = function(req, res, next) {
    if(req.token_userID == undefined || !req.token_userID){
        const e = new Error('userID is empty');
        e.status = 401;
        return next(e);
    }

    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    var sql = `UPDATE PLACE SET placeName = ?,
                content = ?, category = ?, bathroom = ?, water = ?, price = ?, imageKey = ?
                WHERE placeID = ? AND FK_PLACE_userID = ?`;
    var params = [req.body.placeName, req.body.content,req.body.category,
            req.body.bathroom,req.body.water,req.body.price,imageKeyWithComma ,req.params.placeID, req.token_userID];
    db.query(sql,params, function (err, results) {
        if(err){ 
            console.log(err);
            if(err.errno == 1062){
                const error = new Error();
                error.status = 409;
                error.message = 'placeName already exist';
                next(error);
            }else{
                next(err);
            }
            return;
        }
        if(results.affectedRows > 0){
            res.status(200).send('success')
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}

let deletePlace = function (req,res,next) {
    var sql = 'DELETE FROM PLACE WHERE FK_PLACE_userID = ? AND placeID = ?';
    db.query(sql, [req.token_userID, req.params.placeID], async function(err, results) {
        if(err) return next(err);
        if(results.affectedRows > 0){
            try{
                await updateUserInfo(req.token_userID, 'delete');
                res.status(200).send('success');
            }catch(e){
                return next(e);
            }
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}

let updateViewCount = function(placeID){
    var sql = 'UPDATE PLACE SET viewCount = viewCount + 1 WHERE placeID = ?';
    return new Promise(function(resolve, reject){
            db.query(sql, [placeID], function(err , result){
            if(err) { return reject(err);}
            return resolve();
        })
    })
}

let getPlaceInfoByID = function(req, res, next){
    const sql = 'SELECT * FROM PLACE WHERE placeID = ?';
    db.query(sql, [req.params.placeID], async function(err, result){
        if(err) return next(err);

        if(result.length > 0)
        {
            try{
                await updateViewCount(req.params.placeID);
                result = makeImageArray(result, 'place');
                res.status(200).send(result[0]);
            }catch(e){
                return next(e);
            }
        }else{
            const e = new Error('row not found');
            e.status = 404;
            return next(e);
        }
    })
}

let getBest = function(req, res, next){
    const sql = `SELECT plc.*, user.userNickName, user.profileImg FROM PLACE plc 
                    LEFT JOIN USER user ON plc.FK_PLACE_userID = user.userID
                    order by (plc.reviewCount + plc.wishCount) DESC 
                    LIMIT ${req.params.page} , ${req.params.parseNum}`;
    db.query(sql, function(err, results){
        if(err) return next(err);
        results = makeImageArray(results, 'place');
        res.status(200).send(results);
    })
}
// let getPlaceRanking = function(req, res, next){
//     var sql = 'SELECT * FROM PLACE order by reviewCount + '
// }
module.exports = {
    getPlaceList : getPlaceList,
    postPlace : postPlace,
    putPlace : putPlace,
    deletePlace : deletePlace,
    updateViewCount : updateViewCount,
    getPlaceInfoByID : getPlaceInfoByID,
    getBest : getBest
}