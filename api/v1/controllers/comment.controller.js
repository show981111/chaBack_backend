const db = require('../../../dbConnection/mariaDB.js');
var Promise = require('promise');


let updateCommunityInfo = function(communityID, option){
    var sql;
    if(option == 'insert'){
        sql = 'UPDATE COMMUNITY SET commentsNum = commentsNum + 1 WHERE communityID = ?';
    }else{
        sql = 'UPDATE COMMUNITY SET commentsNum = commentsNum - 1 WHERE communityID = ?';
    }   
    return new Promise(function(resolve, reject) {
        db.query(sql, [communityID], function(err, results) {
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


//post
let postComment = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    const sql = 'INSERT INTO COMMENT(FK_COMMENT_userID, FK_COMMENT_communityID, content, updated) VALUES(?,?,?,?)';
    const params = [req.token_userID, req.body.communityID, req.body.content, updated];

    db.query(sql, params, async function(err, result){
        if(err){
            console.log(err);
            if(err.errno == 1452){
                const e = new Error('unable to find Foreign Key');
                e.status = 404;
                return next(e);
            }
            return next(err);
        }

        try{
            await updateCommunityInfo(req.body.communityID, 'insert');
            res.status(200).send({commentID : result.insertId})
        }catch(e){
            console.log(e);
            return next(e);
        }
    })
}

//get Comments By parent ID 
let getCommentsByParent = function(req, res, next){
    const sql = `SELECT C.*, U.userNickName, U.profileImg FROM COMMENT C 
                    LEFT JOIN USER U ON U.userID = C.FK_COMMENT_userID
                    WHERE C.FK_COMMENT_communityID = ?`;
    db.query(sql, [req.params.communityID], function(err, results){
        if(err) return next(err);

        res.status(200).send(results);
    })
}

//get Comments By userID w/ posts 
let getCommentsByUserID = function(req, res, next){
    const sql = `SELECT C.*, U.userNickName, U.profileImg FROM COMMENT C
                    LEFT JOIN USER U ON U.userID = C.FK_COMMENT_userID
                    WHERE C.FK_COMMENT_userID = ? LIMIT ${req.params.pageNumber}, 20`;
    db.query(sql, [req.params.userID], function(err, results){
        if(err) return next(err);

        res.status(200).send(results);
    }) 
}

let updateComment = function(req, res, next){
    const sql = 'UPDATE COMMENT SET content = ? WHERE FK_COMMENT_userID = ? AND commentID = ?';
    db.query(sql, [ req.body.content ,req.token_userID, req.params.commentID], function(err, result){
        if(err) return next(err);

        if(result.affectedRows > 0 ){
            res.status(200).send('success');
        }else{
            const e = new Error('row not found');
            e.status = 404;
            return next(e);
        }
    })
}

let deleteComment = function(req, res, next){
    var sql = 'DELETE FROM COMMENT WHERE FK_COMMENT_userID = ? AND commentID = ? RETURNING FK_COMMENT_communityID';
    var params = [req.token_userID, req.params.commentID];
    if(req.isAdmin){
        sql = 'DELETE FROM COMMENT WHERE commentID = ? RETURNING FK_COMMENT_communityID';
        params = [req.params.commentID];
    }
    db.query(sql, params, async function(err, result){
        if(err) return next(err);

        if(result && result.length > 0 && result[0].FK_COMMENT_communityID !== undefined){
            try{
                await updateCommunityInfo(result[0].FK_COMMENT_communityID, 'delete');
                res.status(200).send('success');
            }catch(e){
                return next(e);
            }
        }else{
            const e = new Error('row not found');
            e.status = 404;
            return next(e);
        }
    })
}

module.exports = {
    postComment : postComment,
    getCommentsByParent : getCommentsByParent,
    getCommentsByUserID : getCommentsByUserID,
    updateComment : updateComment,
    deleteComment : deleteComment,
}