const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');
const makeImageKey = require('../utils/makeImageKey.js');
const makeImageArray = require('../utils/makeImageArray.js');


let postGear = function(req, res, next){

    if(!req.isAdmin) {
        const e = new Error('not admin');
        e.status = 401;
        return next(e)
    }
    var imageKeyWithComma = makeImageKey(req.body.imageKey);
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

    const sql = `INSERT INTO GEAR(title, category, content, updated, FK_GEAR_userID, price,imageKey)
                    VALUES(?,?,?,?,?,?,?)`;
    const params = [req.body.title, req.body.category, req.body.content, updated, req.token_userID, req.body.price ,imageKeyWithComma];

    db.query(sql, params, function(err, result){
        if(err) {
            console.log(err)
            return next(new Error());
        }
        res.status(200).send({ gearID : result.insertId })
    })
}

let deleteGear = function(req, res, next){
    if(!req.isAdmin) {
        const e = new Error('not admin');
        e.status = 401;
        return next(e)
    }

    const sql = 'DELETE FROM GEAR WHERE gearID = ? RETURNING imageKey, FK_GEAR_userID';

    db.query(sql, [req.params.gearID], function(err, result){
        if(err) {
            return next(new Error());
        }
        console.log(result);
        if(result && result.length > 0){
            req.token_userID = result[0].FK_GEAR_userID;
            if(result[0].imageKey) {
                req.body.imageKey = result[0].imageKey.split(',');
            }
            next();
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            return next(e);
        }
    })
}

let putGear = function(req, res, next){
    if(!req.isAdmin) {
        const e = new Error('not admin');
        e.status = 401;
        return next(e)
    }
    
    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    //const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    const sql = 'UPDATE GEAR SET title = ?, category = ?, content = ?, price = ?,imageKey = ? WHERE gearID = ?';

    db.query(sql, [req.body.title, req.body.category, req.body.content, req.body.price ,imageKeyWithComma,
                    req.params.gearID], function(err, result){
        if(err) {
            console.log(err);
            return next(new Error());
        }

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            return next(e);
        }
    })
}

let getGear = function(req, res, next){
    const sql = `SELECT A.*, user.userNickName, user.profileImg FROM GEAR A
                    LEFT JOIN USER user ON A.FK_GEAR_userID = user.userID
                    order by gearID DESC LIMIT ${req.params.page} , 20`;

    db.query(sql, function(err, results){
        if(err) {
            return next(err);
        }

        results = makeImageArray(results, 'gear');
        res.status(200).send(results);
       
    })
}

let getGearInfoByID = function(req, res, next){
    const sql = `SELECT A.*, user.userNickName, user.profileImg FROM GEAR A
                    LEFT JOIN USER user ON A.FK_GEAR_userID = user.userID
                    WHERE A.gearID = ?`;
    db.query(sql, req.params.gearID, function(err, result){
        if(err) return next(err);

        if(result && result.length > 0){
            result = makeImageArray(result, 'gear');
            res.status(200).send(result[0]);
        }else{
            const e = new Error('gear not found');
            e.status = 404;
            return next(e);
        }
    })
    
}

module.exports = {
    postGear : postGear,
    deleteGear : deleteGear,
    putGear : putGear,
    getGear : getGear,
    getGearInfoByID : getGearInfoByID
}