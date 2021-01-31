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

let putGearReview = function (req, res, next) {
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;

    const sql = `UPDATE GEAR_REVIEW SET content = ?, updated = ?, point = ?
                    WHERE FK_GREVIEW_userID = ? AND gearReviewID = ? AND FK_GREVIEW_gearID = ?`;
    const params = [req.body.content, updated, req.body.point, req.token_userID, req.params.gearReviewID
                        ,req.body.gearID ];
    db.query(sql, params, async function (err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            try{
                await updateGearInfo(req.body.gearID, req.body.pointGap, 'update');
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
    const sql = 'DELETE FROM GEAR_REVIEW WHERE FK_GREVIEW_userID = ? AND gearReviewID = ? AND FK_GREVIEW_gearID = ?';
    db.query(sql, [req.token_userID, req.params.gearReviewID, req.params.gearID], async function(err, results) {
        if(err) {console.log(err); return next(err);}

        if(results.affectedRows > 0){
            try{
                await updateGearInfo(req.params.gearID, req.params.point, 'delete');
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