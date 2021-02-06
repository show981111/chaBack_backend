const db = require('../../../dbConnection/mariaDB.js');
const makeImageKey = require('../utils/makeImageKey.js');
const makeImageArray = require('../utils/makeImageArray.js')

var postCommunity = function(req, res, next){
    const sql = `INSERT INTO COMMUNITY(title, content, category, FK_COMMUNITY_userID, imageKey, updated)
                    VALUES(?, ?, ?, ?, ? ,?)`;
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var imageKeyWithComma = makeImageKey(req.body.imageKey);
    const params = [req.body.title, req.body.content, req.body.category, req.token_userID, 
                    imageKeyWithComma, updated];

    db.query(sql, params, function(err, result){
        if(err) { console.log(err); return next(err);}

        if(result.affectedRows > 0){
            //next() 해서 aws에 이미지 삽입! 
            res.status(200).send({
                communityID : result.insertId
            })
        }else{
            next(new Error());
        }
    })
    
}

var getCommunities = function(req, res, next){
    const sql = `SELECT C.*, U.userNickName, U.profileImg FROM COMMUNITY C
                    LEFT JOIN USER U ON C.FK_COMMUNITY_userID = U.userID
                    WHERE category = ? order by communityID DESC LIMIT ${req.params.pageNumber}, 20`;
    db.query(sql, [req.params.category],function(err, results){
        if(err){ console.log(err); return next(err);}

        results= makeImageArray(results, 'community');
        res.status(200).send(results);
    })
}

var getCommunityByUserID = function(req, res , next){
    const sql = `SELECT C.*, U.userNickName, U.profileImg FROM COMMUNITY C 
                    LEFT JOIN USER U ON C.FK_COMMUNITY_userID = U.userID
                    WHERE FK_COMMUNITY_userID = ? order by communityID DESC LIMIT ${req.params.pageNumber}, 20`;
    db.query(sql, [req.params.userID ],function(err, results){
        if(err){ console.log(err); return next(err);}

        results= makeImageArray(results, 'community');
        res.status(200).send(results);
    }) 
}

var updateCommunity = function(req, res, next){
    const updated = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ;
    var imageKeyWithComma = makeImageKey(req.body.imageKey);

    const sql = 'UPDATE COMMUNITY SET content = ?, title = ?, updated = ?, imageKey = ? WHERE communityID = ? AND FK_COMMUNITY_userID = ?';
    const params = [req.body.content, req.body.title, updated, imageKeyWithComma, req.params.communityID, req.token_userID];
    db.query(sql, params, function(err, result){
        if(err){
            return next(err);
        }

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('row not found');
            e.status = 404;
            return next(e);
        }
    })
}

var deleteCommunity = function(req, res, next){
    const sql = 'DELETE FROM COMMUNITY WHERE communityID = ? AND FK_COMMUNITY_userID = ?'
   
    db.query(sql, [req.params.communityID, req.token_userID], function(err, result){
        if(err){
            return next(err);
        }

        if(result.affectedRows > 0){
            res.status(200).send('success');
        }else{
            const e = new Error('row not found');
            e.status = 404;
            return next(e);
        }
    })
}

module.exports = {
    postCommunity: postCommunity,
    getCommunities : getCommunities,
    getCommunityByUserID : getCommunityByUserID,
    updateCommunity : updateCommunity,
    deleteCommunity : deleteCommunity
}