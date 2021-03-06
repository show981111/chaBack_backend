const db = require('../../../dbConnection/mariaDB.js');

let updateReviewInfo = function(reviewID, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE REVIEW SET replyCount = replyCount + 1 WHERE reviewID = ?';
    }else{
        //sql = 'UPDATE REVIEW SET replyCount = replyCount - 1 WHERE reviewID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [reviewID], function(err, results) {
            if(err) {
                console.log(err);
                reject(err);
            }
            
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

let postReply = function(req, res, next){
    var sql;
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var params = [req.body.content, req.token_userID, updated, req.body.reviewID];
    if(req.body.replyParentID == undefined){
        sql = 'INSERT INTO REPLY(content, FK_REPLY_userID, updated, FK_REPLY_reviewID) VALUES(?,?,?,?)';
    }else{
        sql = 'INSERT INTO REPLY(content, FK_REPLY_userID, updated, FK_REPLY_reviewID, replyParentID) VALUES(?,?,?,?,?)';
        params.push(req.body.replyParentID);
    }
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
                await updateReviewInfo(req.body.reviewID, 'insert');
                res.status(200).send({ replyID : result.insertId });
            }catch(error){
                return next(error);
            }
        }else{
            return next(new Error());
        }
    })
}

let putReply = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var sql = 'UPDATE REPLY SET content = ? , updated = ? WHERE replyID = ? AND FK_REPLY_userID = ?';

    db.query(sql, [req.body.content, updated, req.params.replyID, req.token_userID], function(err, result){
        if(err) return next(err);

        if(result.affectedRows > 0){
            res.send('success');
        }else{
            const e = new Error('Not Found');
            e.status = 404;
            return next(e);
        }
    })
}

/**
 * @param {string} option 
 */

let getReply = function(option){
    return function(req, res, next){
        var sql;
        var params;
        if(option == 'userID'){
            sql = 'SELECT A.*, B.userNickName, B.profileImg FROM REPLY A JOIN USER B ON A.FK_REPLY_userID = B.userID WHERE A.FK_REPLY_userID = ? order by A.replyID DESC';
            params = [req.params.userID];
        }else if(option == 'rereply'){
            sql = 'SELECT A.*, B.userNickName, B.profileImg FROM REPLY A JOIN USER B ON A.FK_REPLY_userID = B.userID WHERE A.replyParentID = ?';
            params = [req.params.replyParentID];
        }
        else{
            sql = `SELECT A.*, COUNT(B.replyID) as childCount, C.userNickName, C.profileImg FROM REPLY A
                        LEFT JOIN REPLY B ON A.replyID = B.replyParentID 
                        LEFT JOIN USER C ON A.FK_REPLY_userID = C.userID
                        WHERE A.FK_REPLY_reviewID = ? AND A.replyParentID IS NULL 
                        group by A.replyID
                        order by A.replyID ASC`;
            params = [req.params.reviewID];
        }
        db.query(sql, params, function(err, results){
            if(err){ 
                console.log(err);
                return next(err);
            }

            res.send(results);
        })
    }
}

let deleteReply = function(req, res, next){
    var sql = 'DELETE FROM REPLY WHERE FK_REPLY_userID = ? AND replyID = ? RETURNING FK_REPLY_reviewID';
    var params = [req.token_userID, req.params.replyID];

    if(req.isAdmin){
        sql = 'DELETE FROM REPLY WHERE replyID = ? RETURNING FK_REPLY_reviewID';
        params = [req.params.replyID];
    }
    db.query(sql, params, async function(err, result){
        if(err) return next(err);
        res.send('success');
        // if(result && result.length > 0 && result[0].FK_REPLY_reviewID !== undefined){

        //     try{
        //         await updateReviewInfo(result[0].FK_REPLY_reviewID, 'delete');
        //         res.send('success');
        //     }catch(e){
        //         return next(e);
        //     }

        // }else{
        //     const e = new Error('Not Found');
        //     e.status = 404;
        //     return next(e);
        // }
    })
}

module.exports = {
    postReply : postReply,
    putReply : putReply,
    getReply : getReply,
    deleteReply : deleteReply 
}