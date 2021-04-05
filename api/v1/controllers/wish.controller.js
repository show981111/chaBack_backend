const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
const makeImageArray = require('../utils/makeImageArray.js')

let updatePlace = function(option, placeID){
    var sql;
    if(option == 'post'){
        sql = 'UPDATE PLACE SET wishCount = wishCount + 1 WHERE placeID = ?';
    }else{
        sql = 'UPDATE PLACE SET wishCount = wishCount - 1 WHERE placeID = ?';
    }
    return new Promise(function(resolve, reject){
        db.query(sql, [placeID], function(err, result){
            if(err) return reject(err);

            if(result.affectedRows > 0){
                resolve();
            }else{
                const e = new Error('row not found');
                e.status = 404;
                reject(e);
            }
        })
    });
}

let postWish = function(req, res, next){
    var sql = 'INSERT INTO WISH(FK_WISH_userID, FK_WISH_placeID) VALUES(?,?)';
    var params = [req.token_userID,req.params.placeID];

    db.query(sql, params, async function(err, result){
        
        if(err) {
            console.log(err);
            if(err.errno == 1452){
                const e = new Error('ID Not Found');
                e.status = 404;
                return next(e);
            }else if(err.errno == 1062){
                return res.status(204).send('already posted');
            }
            return next(err)
        }

        try{
            await updatePlace('post', req.params.placeID);
        }catch(e){
            return next(e);
        }
        res.status(200).send('success');
        
    })
}

let deleteWish = function(req, res, next){
    var sql = 'DELETE FROM WISH WHERE FK_WISH_userID = ? AND FK_WISH_placeID = ?';
    params = [req.token_userID, req.params.placeID];

    db.query(sql , params, async function(err, result){
        if(err) {console.log(err); return next(err)}

        if(result.affectedRows > 0){ 
            try{
                await updatePlace('delete', req.params.placeID);
            }catch(e){
                return next(e);
            }
            res.status(200).send('success');
        }else{
            const e = new Error('ID Not Found');
            e.status = 404;
            next(e);
        }
    })
}


let getWish = function(req, res, next){
    var sql = `SELECT A.*, plc.*, user.userNickName FROM WISH A
                LEFT JOIN PLACE plc ON A.FK_WISH_placeID = plc.placeID
                LEFT JOIN USER user ON plc.FK_PLACE_userID = user.userID
                WHERE FK_WISH_userID = ? order by A.id DESC`;
    params = [req.params.userID];

    db.query(sql , params, function(err, result){
        if(err) {console.log(err); return next(err)}
        result = makeImageArray(result, 'place');
        res.status(200).send(result);
    })
}

module.exports = {
    postWish : postWish, 
    deleteWish : deleteWish,
    getWish : getWish
}