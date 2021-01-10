const db = require('../../../dbConnection/mariaDB.js');

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
    db.query(sql, params, function(err, result){
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
            res.status(200).send({ replyID : result.insertId });
        }else{
            return next(new Error());
        }
    })
}

let putReply = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var sql = 'UPDATE REPLY SET content = ? , updated = ? WHERE replyID = ? AND FK_REPLY_userID = ?';
    console.log(req.params.replyID)
    console.log(req.token_userID)
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
            sql = 'SELECT * FROM REPLY WHERE FK_REPLY_userID = ? order by replyID DESC';
            params = [req.params.userID];
        }else if(option == 'rereply'){
            sql = 'SELECT * FROM REPLY WHERE replyParentID = ?';
            params = [req.params.replyParentID];
        }
        else{
            sql = `SELECT A.*, COUNT(B.replyID) as childCount FROM test.REPLY A
                        LEFT JOIN test.REPLY B ON A.replyID = B.replyParentID 
                        WHERE A.FK_REPLY_reviewID = ? AND A.replyParentID IS NULL 
                        group by A.replyID
                        order by A.replyID DESC`;
            params = [req.params.reviewID];
        }
        db.query(sql, params, function(err, results){
            if(err) return next(err);

            res.send(results);
        })
    }
}

let deleteReply = function(req, res, next){
    var sql = 'DELETE FROM REPLY WHERE FK_REPLY_userID = ? AND replyID = ?';

    db.query(sql, [req.token_userID, req.params.replyID], function(err, result){
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

module.exports = {
    postReply : postReply,
    putReply : putReply,
    getReply : getReply,
    deleteReply : deleteReply 
}