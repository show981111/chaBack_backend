const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');

let updateReview = function(option, reviewID){
    var sql;
    if(option == 'post'){
        sql = 'UPDATE REVIEW SET likeCount = likeCount + 1 WHERE reviewID = ?';
    }else{
        sql = 'UPDATE REVIEW SET likeCount = likeCount - 1 WHERE reviewID = ?';
    }
    return new Promise(function(resolve, reject){
        db.query(sql, [reviewID], function(err, result){
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

let postLike =function(endPoint){
    var sql;
    if(endPoint == 'review'){
        sql = 'INSERT INTO `LIKE`(FK_LIKE_userID, FK_LIKE_reviewID) VALUES(?, ?)';
    }
    return function(req, res, next){
        params = [req.token_userID, req.body.id];

        db.query(sql , params, async function(err, result){
            if(err) {
                console.log(err);
                if(err.errno == 1452){
                    const e = new Error('ID Not Found');
                    e.status = 404;
                    return next(e);
                }else if(err.errno == 1062){
                    return res.status(204).send('already posted');;    
                }
                return next(err)
            }

            try{
                await updateReview('post', req.body.id);
            }catch(e){
                return next(e);
            }
            res.status(200).send('success');
        })
    }
}

let deleteLike =function(endPoint){
    var sql;
    if(endPoint == 'review'){
        sql = 'DELETE FROM `LIKE` WHERE FK_LIKE_userID = ? AND FK_LIKE_reviewID = ?';
    }
    return function(req, res, next){
        params = [req.token_userID, req.body.id];

        db.query(sql , params, async function(err, result){
            if(err) {return next(err)}

            if(result.affectedRows > 0){ 
                try{
                    await updateReview('delete', req.body.id);
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
}

let getLike =function(endPoint){
    var sql;
    if(endPoint == 'review'){
        var sql = 'SELECT * FROM `LIKE` WHERE FK_LIKE_userID = ? AND FK_LIKE_reviewID is not NULL';
    }
    return function(req, res, next){
        params = [req.params.userID];

        db.query(sql , params, function(err, result){
            if(err) {console.log(err); return next(err)}

            res.status(200).send(result);
        })
    }
}

module.exports = {
    postLike : postLike, 
    deleteLike : deleteLike,
    getLike : getLike
}