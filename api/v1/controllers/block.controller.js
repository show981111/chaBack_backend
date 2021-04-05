const db = require('../../../dbConnection/mariaDB.js');

let postBlockUser = function(req, res, next){
    var sql = 'INSERT INTO BLOCK(blockingUserID, blockedUserID) VALUES(? , ?)';
    db.query(sql, [req.token_userID, req.body.blockedUserID], function(err, result){
        if(err) {
            if(err.errno == 1452){
                const e = new Error('unable to find Foreign Key');
                e.status = 404;
                return next(e);
            }else if(err.errno == 1062){
                return res.status(204).send('already posted');
            }
            return next(err);
        }
        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            next(new Error('affctedRows are zero'));
        }
    })
}

let deleteBlockUser = function(req, res, next){
    var sql = 'DELETE FROM BLOCK WHERE blockingUserID = ? AND blockedUserID = ?';
    db.query(sql, [req.token_userID, req.params.blockedUserID], function(err, result){
        if(err) return next(err);

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('row to delete was not found')
            e.status = 404
            next(e);
        }
    })
}

let getBlockedUser = function(req, res, next){
    var sql = 'SELECT * FROM BLOCK WHERE blockingUserID = ?';
    db.query(sql, [req.token_userID], function(err, results){
        if(err) return next(err);

        res.status(200).send(results);
    })
}

module.exports = {
    postBlockUser : postBlockUser,
    deleteBlockUser : deleteBlockUser,
    getBlockedUser : getBlockedUser
}