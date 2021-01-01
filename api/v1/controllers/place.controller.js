const db = require('../../../dbConnection/mariaDB.js');
const queryBuilder = require('../utils/filterQueryBuilder.js');

let getPlaceList = function(req, res, next){
    var sql = queryBuilder.filterQueryBuilder(req.params.region, req.params.category, 
        req.params.bathroom, req.params.water, req.params.price, req.params.before);
    console.log(sql);
    db.query(sql.sql, sql.params, function(err, results) {
        if(err) return next(err);
        console.log(this.sql);
        //console.log(results);
        res.status(200).send(results);
    })
}

let postPlace = function(req, res, next) {
    if(req.token_userID == undefined || !req.token_userID){
        const e = new Error('userID is empty');
        e.status = 401;
        return next(e);
    }
    var sql = `INSERT INTO PLACE(placeName, userID, lat, lng, address, region, content, category, bathroom, water, price, totalPoint, imageKey)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
    var params = [req.body.placeName, req.token_userID, req.body.lat, req.body.lng, req.body.address,req.body.region,req.body.content,
                    req.body.category, req.body.bathroom,req.body.water,req.body.price,req.body.point, req.body.imageKey];
    db.query(sql,params, function (err, results) {
        if(err){ 
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
            res.status(200).send('success')
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
    var sql = `UPDATE PLACE SET placeName = ?, userID = ?, lat = ?, lng = ?, address = ?, region = ?, 
                content = ?, category = ?, bathroom = ?, water = ?, price = ?, totalPoint = ?
                WHERE placeID = ? AND userID = ?`;
    var params = [req.body.placeName, req.token_userID, req.body.lat, req.body.lng, req.body.address,req.body.region,req.body.content,
                    req.body.category, req.body.bathroom,req.body.water,req.body.price,req.body.point ,req.params.placeID, req.token_userID];
    db.query(sql,params, function (err, results) {
        if(err){ 
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
    var sql = 'DELETE FROM PLACE WHERE userID = ? AND placeID = ?';
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
    deletePlace : deletePlace
}