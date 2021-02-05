const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
const makeImageArray = require('../utils/makeImageArray.js');

let postRealTime = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    const sql = 'INSERT INTO REALTIME(content, FK_REALTIME_userID, FK_REALTIME_placeID, updated) VALUES(?, ?, ?, ?)';
    db.query(sql, [req.body.content, req.token_userID, req.body.placeID, updated], function(err, result){
        if(err){ 
            console.log(err);
            if(err.errno == 1452){
                const e = new Error('placeID Not Found');
                e.status = 404;
                return next(e);
            }else{
                return next(err);
            }
        }

        if(result.affectedRows > 0){
            res.status(200).send({
                realTimeID : result.insertId
            })
        }else{
            next(new Error());
        }
    })
}

let putRealTime = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    const sql = 'UPDATE REALTIME SET content = ?, updated = ? WHERE FK_REALTIME_userID = ? AND realTimeID = ?';
    db.query(sql, [req.body.content, updated, req.token_userID, req.params.realTimeID], function(err, result){
        if(err) return next(err);

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('row not found');
            e.status = 404;
            next(e);
        }
    })
}

let deleteRealTime = function(req, res, next){
    const sql = 'DELETE FROM REALTIME WHERE FK_REALTIME_userID = ? AND realTimeID = ?';
    db.query(sql, [req.token_userID, req.params.realTimeID], function(err, result){
        if(err) return next(err);

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('row not found');
            e.status = 404;
            next(e);
        }
    })
}

//router.get('/place/:pageNumber/:parseNum', 
let getAllRealTime = function(req, res, next){
    const sql = `SELECT R.*, P.placeName, U.userNickName, U.profileImg FROM REALTIME R
                    LEFT JOIN PLACE P ON R.FK_REALTIME_placeID = P.placeID
                    LEFT JOIN USER U ON R.FK_REALTIME_userID = U.userID
                    order by R.realTimeID DESC LIMIT ${req.params.pageNumber}, ${req.params.parseNum}`;
    db.query(sql , function(err, results){
        if(err) return next(err);

        res.status(200).send(results)
    })
}

//router.get('/place/:placeID/:pageNumber/:parseNum', 
let getRealTimeByPlaceID = function(req, res, next){
    const sql = `SELECT R.*, U.userNickName, U.profileImg FROM REALTIME R 
                    LEFT JOIN USER U ON R.FK_REALTIME_userID = U.userID
                    WHERE FK_REALTIME_placeID = ? 
                    order by realTimeID DESC LIMIT ${req.params.pageNumber}, ${req.params.parseNum}`;
    db.query(sql ,[req.params.placeID] ,function(err, results){
        if(err) return next(err);

        res.status(200).send(results)
    })
}

module.exports = {
    postRealTime: postRealTime,
    putRealTime : putRealTime,
    deleteRealTime : deleteRealTime,
    getAllRealTime : getAllRealTime,
    getRealTimeByPlaceID : getRealTimeByPlaceID
}