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

    const sql = `INSERT INTO GEAR(title, category, content, updated, FK_GEAR_userID, imageKey)
                    VALUES(?,?,?,?,?,?)`;
    const params = [req.body.title, req.body.category, req.body.content, updated, req.token_userID, imageKeyWithComma];

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

    const sql = 'DELETE FROM GEAR WHERE gearID = ?';

    db.query(sql, [req.params.gearID], function(err, result){
        if(err) {
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

let putGear = function(req, res, next){
    if(!req.isAdmin) {
        const e = new Error('not admin');
        e.status = 401;
        return next(e)
    }
    
    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

    const sql = 'UPDATE GEAR SET title = ?, category = ?, content = ?, updated = ?, imageKey = ? WHERE gearID = ?';

    db.query(sql, [req.body.title, req.body.category, req.body.content, updated, imageKeyWithComma,
                    req.params.gearID], function(err, result){
        if(err) {
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
    sql = `SELECT A.* FROM GEAR A order by gearID DESC LIMIT ${req.params.page} , 20`;

    db.query(sql, function(err, results){
        if(err) {
            return next(new Error());
        }

        results = makeImageArray(results, 'gear');
        res.status(200).send(results);
       
    })
}


module.exports = {
    postGear : postGear,
    deleteGear : deleteGear,
    putGear : putGear,
    getGear : getGear
}