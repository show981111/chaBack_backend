const db = require('../../../dbConnection/mariaDB.js');

let updateGearInfo = function(gearID, point, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE GEAR SET totalPoint = totalPoint + ?, reviewCount = reviewCount + 1 WHERE gearID = ?';
    }else if(option == 'update'){// point = curPoint - pastPoint
        sql = 'UPDATE GEAR SET totalPoint = totalPoint + ? WHERE gearID = ?';
    }else if(option == 'delete'){
        sql = 'UPDATE GEAR SET totalPoint = totalPoint - ?, reviewCount = reviewCount - 1 WHERE gearID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [point, gearID], function(err, results) {
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

//gearID, content, point 
let postGearReview = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var params = [req.body.gearID, req.token_userID, req.body.content, updated, req.body.point];
    const sql = `INSERT INTO GEAR_REVIEW(FK_GREVIEW_gearID, FK_GREVIEW_userID, content, updated, point) 
                    VALUES(?, ? ,? ,? ,?)`;
    db.query(sql, params, async function(err, result){
        if(err){
            //console.log(err);
            if(err.errno == 1452){
                const e = new Error('unable to find Foreign Key');
                e.status = 404;
                return next(e);
            }
            return next(err);
        };

        if(result.affectedRows > 0){
            try{
                await updateGearInfo(req.body.gearID, req.body.point, 'insert');
                res.status(200).send({ gearReviewID : result.insertId });
            }catch(err){
                return next(err);
            }
        }else{
            next(new Error());
        }
    })
}

let getGearInfo = function(gearReviewID){
    const sql = 'SELECT point,FK_GREVIEW_gearID FROM GEAR_REVIEW WHERE gearReviewID = ?';
    return new Promise(function(resolve, reject) {
        db.query(sql, [gearReviewID], function(err, result) {
            if(err) reject(err);
            if(result.length > 0 && result[0].point !== undefined && result[0].FK_GREVIEW_gearID !== undefined){
                resolve(result[0]);
            }else{
                const e = new Error('Not Found');
                e.status = 404;
                reject(e);
            }
        })
    });
}

let putGearReview = async function (req, res, next) {
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var gearInfo;
    try{
        gearInfo = await getGearInfo(req.params.gearReviewID);
    }catch(e){
        return next(e);
    }

    const sql = `UPDATE GEAR_REVIEW SET content = ?, updated = ?, point = ?
                    WHERE FK_GREVIEW_userID = ? AND gearReviewID = ?`;
    const params = [req.body.content, updated, req.body.point, req.token_userID, req.params.gearReviewID];
    db.query(sql, params, async function (err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            try{
                await updateGearInfo(gearInfo.FK_GREVIEW_gearID, req.body.point - gearInfo.point, 'update');
                res.status(200).send('success');
            } catch(err){
                console.log(err);
                return next(err);
            }
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            next(e);
        }
    })
}

let deleteGearReview = function (req, res, next) {
    var sql = 'DELETE FROM GEAR_REVIEW WHERE FK_GREVIEW_userID = ? AND gearReviewID = ? RETURNING point, FK_GREVIEW_gearID';
    var params = [req.token_userID, req.params.gearReviewID];

    if(req.isAdmin){
        sql = 'DELETE FROM GEAR_REVIEW WHERE gearReviewID = ? RETURNING point, FK_GREVIEW_gearID';
        params = [ req.params.gearReviewID];
    }
    db.query(sql,params, async function(err, results) {
        if(err) {console.log(err); return next(err);}

        if(results && results.length > 0 && results[0].FK_GREVIEW_gearID !== undefined){
            try{
                await updateGearInfo(results[0].FK_GREVIEW_gearID, results[0].point, 'delete');
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

let getGearReview = function(option){
    return function(req, res, next){
        var sql;
        var params =[];
        if(option == 'userID'){
            sql = 'SELECT * FROM GEAR_REVIEW WHERE FK_GREVIEW_userID = ? order by gearReviewID DESC';
            params.push(req.params.userID);
        }else{
            sql = `SELECT A.*, B.userNickName, B.profileImg FROM GEAR_REVIEW A
                    LEFT JOIN USER B ON A.FK_GREVIEW_userID = B.userID
                    WHERE FK_GREVIEW_gearID = ? order by gearReviewID DESC`;
            params.push(req.params.gearID);
        }
        db.query(sql, params, function(err, results){
            if(err){return next(err);}

            res.status(200).send(results);
        })
    }   
}
module.exports = {
    putGearReview : putGearReview,
    postGearReview : postGearReview,
    deleteGearReview : deleteGearReview,
    getGearReview : getGearReview 
}