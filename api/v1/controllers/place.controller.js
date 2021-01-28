const db = require('../../../dbConnection/mariaDB.js');
const queryBuilder = require('../utils/filterQueryBuilder.js');
var Promise = require('promise');
//const placeModel = require('../model/place.js');
const makeImageKey = require('../utils/makeImageKey.js');
require('dotenv').config();

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
            for(var i = 0; i < results.length ; i++){
                var imageKeyArr = results[i].imageKey.split(',');
                var resizedImages = [];
                var originalImages = [];
                for(var j = 0; j < imageKeyArr.length; j++){
                    if(!imageKeyArr[j] || imageKeyArr[j] == null) continue;
                    resizedImages.push(`${process.env.BUCKET_PATH}/images/resize/${results[i].FK_PLACE_userID}/${imageKeyArr[j]}`);
                    originalImages.push(`${process.env.BUCKET_PATH}/images/original/${results[i].FK_PLACE_userID}/${imageKeyArr[j]}`);
                }
                results[i].resizedImages = resizedImages;
                results[i].originalImages = originalImages;
            }

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
        console.log(results.insertId);
        if(results.affectedRows > 0){
            //next() 해서 aws에 이미지 삽입! 
            res.status(200).send({
                placeID : results.insertId
            })
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
    db.query(sql, [req.token_userID, req.params.placeID], function(err, results) {
        if(err) return next(err);
        if(results.affectedRows > 0){
            res.status(200).send('success')
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}
module.exports = {
    getPlaceList : getPlaceList,
    postPlace : postPlace,
    putPlace : putPlace,
    deletePlace : deletePlace,
}