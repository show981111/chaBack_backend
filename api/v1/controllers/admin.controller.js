const db = require('../../../dbConnection/mariaDB.js');
require('dotenv').config();

let checkAdmin = function(req, res, next){
    if(!req.isAdmin) {
        const e = new Error('not admin');
        e.status = 401;
        return next(e)
    }else{
        next();
    }
}

let deleteRow = function(req, res, next){
    var sql;
    switch(req.params.target){
        case 'place':
            sql = 'DELETE FROM PLACE WHERE placeID = ?';
            break;
        case 'community':
            sql = 'DELETE FROM COMMUNITY WHERE communityID = ?';
            break;
        case 'comment':
            sql = 'DELETE FROM COMMENT WHERE commentID = ?';
            break;
        case 'realTime':
            sql = 'DELETE FROM REALTIME WHERE realTimeID = ?';
            break;
        case 'review':
            sql = 'DELETE FROM REVIEW WHERE reviewID = ?';
            break;
        case 'reply':
            sql = 'DELETE FROM REPLY WHERE replyID = ?';
            break;
        default:
            const e = new Error('invalid target');
            e.status = 400;
            return next(e);
    }
    
    db.query(sql, [req.params.id], function(err, result){
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




module.exports = {
    checkAdmin : checkAdmin,
    deleteRow : deleteRow,

}