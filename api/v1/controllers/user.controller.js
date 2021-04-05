const crypto = require('crypto');
const db = require('../../../dbConnection/mariaDB.js');
const jwt = require('../middleware/jwt.js');
const async = require('async');
const nodemailer = require('nodemailer');
require('dotenv').config();

/* LOGIN */

let issueTokens = async function(arg1){
    try{
        if(arg1.isAdmin){
            arg1.accessToken = await jwt.signAdminToken(arg1,'180m', 'accessToken');
            arg1.refreshToken = await jwt.signAdminToken(arg1,'90d', 'refreshToken');
        }else{
            arg1.accessToken = await jwt.signJWT(arg1,'180m', 'accessToken');
            arg1.refreshToken = await jwt.signJWT(arg1,'90d', 'refreshToken');
        }

        return arg1;
    }catch(err){
        return err;
    }
}

let updateRefreshToken = function(arg1 , callback){
    if(arg1 instanceof Error || !arg1){
        return callback(arg1);
    }
    var sql = 'UPDATE USER SET refreshToken = ? WHERE userID = ?';
    db.query(sql, [arg1.refreshToken, arg1.userID], function(err, result){
        if(err){return callback(err);}
        if(result.changedRows > 0){
            callback(null,'done', arg1);
        }else{
            const e = new Error();
            e.message = 'not found';
            e.status = 404;
            callback(e);
        }
    });
}

let getUser =  function(userID,userPassword  , callback){
    var sql = 'SELECT * FROM USER WHERE userID = ?';
    db.query(sql, [userID],  function(error, results, fields){
        if(error) {
            return callback(error); 
        }
        if(results.length > 0){
            // if(isAdmin){
            //     if(results[0].isAdmin != 1){
            //         const e = new Error();
            //         e.message = 'Forbidden';
            //         e.status = 403;
            //         return callback(e);
            //     }
            // }
            crypto.pbkdf2(userPassword, results[0].salt , 100000, 64, 'sha512', async function (err, key) {
                if(err) return callback(err);
                if(key.toString('base64') == results[0].userPassword){
                    results[0].userPassword = undefined;
                    results[0].salt = undefined;
                    callback(null, results[0]);
                }else{
                    const e = new Error();
                    e.message = 'password incorrect';
                    e.status = 409;
                    return callback(e);
                }
            });
        }else{
            const e = new Error();
            e.message = 'not found';
            e.status = 404;
            return callback(e);
        }
    });
}

let login = function(req, res, next){
    async.waterfall([
        async.apply(getUser, req.body.userID, req.body.userPassword),
        issueTokens,
        updateRefreshToken
    ], function(err, result, final) {
        if(err != null){ 
            console.log(err);
            next(err); 
            return;
        }
        if(result == 'done'){
            res.status(200).send(final);
        }else{
            const err = new Error();
            next(err);
        }
    });
}

/* REGISTER */

var checkDuplicate = function(userID, userNickName ,callback){
	var sql = 'SELECT * FROM USER WHERE userID = ? OR userNickName = ?';
	db.query(sql ,[userID, userNickName] , function(error, results, fields){
        if(error) return callback(error); 
        
        if(results != null && results.length > 0) {
            const e = new Error();
            e.message = 'userID already exist';
            e.status = 409;
            return callback(e);
        }else{
            callback(null);
        }
        
    });
}


let cryptoPassword = function(userPassword, callback){
    crypto.randomBytes(64, (err, buf) => {
    salt = buf.toString('base64');
    crypto.pbkdf2(userPassword, salt, 100000, 64, 'sha512', (err, key) => {
            if(err){ return callback(err); }
            else{
                hashedPW = key.toString('base64');
                result = {
                    hashedPW : hashedPW,
                    salt : salt
                }
                callback(null, result);
            }
        });
    });
}


let register = function(req, res , next){
    async.waterfall([
        async.apply(checkDuplicate, req.body.userID, req.body.userNickName),
        async.apply(cryptoPassword, req.body.userPassword),
        async function(arg1){
            try{
                arg1.accessToken = await jwt.signJWT({userID : req.body.userID},'15m', 'accessToken');
                arg1.refreshToken = await jwt.signJWT({userID : req.body.userID},'90d', 'refreshToken');
                return arg1;
            }catch(err){
                return err;
            }
        },
        function(arg1, callback){
            var sql = `INSERT INTO USER(userID, userPassword, userNickName, userName, userPhone, salt, refreshToken) 
                         VALUES (?,?,?,?,?,?,?)`;
            var params = [req.body.userID, arg1.hashedPW, req.body.userNickName, req.body.userName, req.body.userPhone, arg1.salt, arg1.refreshToken];
            db.query(sql, params, function(err, results, fields){
                if(err) {console.log(err); return callback(err);}
                
                if(results.affectedRows > 0)
                {
                    callback(null, 'done', arg1.accessToken, arg1.refreshToken);
                }else{
                    const e = new Error();
                    return callback(e);
                }  
            })
        }
    ], function(err, result, acc, ref) {
        if(err != null){ 
            next(err); 
            return;
        }
        if(result == 'done'){
            res.status(200).send({
                accessToken : acc,
                refreshToken : ref
            });
        }else{
            const err = new Error();
            next(err);
        }
    });
}

/* chage user information(userNickName or userName or userPhone or profileImg(if set, then should be updated to userID)) */
let updateUserInfo = function(req, res , next){
    
    const sql = `UPDATE USER SET userNickName = ? , userPhone = ? WHERE userID = ?`;
    const params = [req.body.userNickName, req.body.userPhone, req.token_userID];
    db.query(sql, params, function(err, results){
        if(err){
            if(err.errno == 1062){
                const error = new Error();
                error.status = 409;
                error.message = 'userNickName already exist';
                next(error);
            }else{
                next(err);
            }
            return;
        }
        if(results.changedRows > 0){
            res.status(200).send('success');
        }else if(results.affectedRows > 0){
            res.status(204).send('nothing changed');
        }else{
            const error = new Error();
            error.status = 404;
            error.message = 'Not Found';
            next(error);
        }
    })
}

let isVerified = function(userID, callback){
    const sql = 'SELECT verifiedAt FROM VERIFICATION WHERE userID = ?';
    db.query(sql, [userID], function(err, result){
        if(err) return callback(err);

        if(result != null && result.length > 0 )
        {
            if(Math.floor(Date.now() / 1000) - result[0].verifiedAt >= 0 && Math.floor(Date.now() / 1000) - result[0].verifiedAt < 180 ){
                callback(null);
            }else{
                const e = new Error();
                e.message = 'outDated';
                e.status = 403;
                callback(e);
            }
        }else{
            const e = new Error();
            e.message = 'not verified';
            e.status = 403;
            callback(e);
        }
    })
}
/* reset user password */
let resetPassword= function(req, res, next){
    async.waterfall([
        async.apply(isVerified, req.body.userID),
        async.apply(cryptoPassword, req.body.userPassword),
        function(arg1, callback){
            var sql = `UPDATE USER SET userPassword = ? , salt = ? WHERE userID = ?`;
            var params = [arg1.hashedPW, arg1.salt, req.body.userID];
            db.query(sql, params, function(err, results, fields){
                if(err) {console.log(err); return callback(err);}
                
                if(results.changedRows > 0)
                {
                    callback(null, 'done');
                }else{
                    const e = new Error();
                    return callback(e);
                }  
            })
        }
    ], function(err, result) {
        if(err != null){ 
            next(err); 
            return;
        }
        if(result == 'done'){
            res.status(200).send('success');
        }else{
            const err = new Error();
            next(err);
        }
    });
}

let getBest = function(req, res, next){
    const sql = `SELECT user.userID, user.userNickName, user.profileImg, user.userName, user.userPhone, user.placeCount, user.reviewCount FROM USER user
                    order by (1*user.reviewCount + 2*user.placeCount) DESC 
                    LIMIT ${req.params.page} , ${req.params.parseNum}`;
    db.query(sql, function(err, results){
        if(err) return next(err);
        res.status(200).send(results);
    })
}

let transporter = nodemailer.createTransport({
	service: 'Naver',
	host: 'smtp.naver.com',
	port: 587,
	secure: false,
	auth: {
	  user: process.env.emailUserID,
	  pass: process.env.emailUserPassword,
	},
});

/**Send Email to User */
let postReport = function(option){

    return function(req, res, next){
        var sql;
        if(option == 'community')
        {
            sql = 'SELECT * FROM COMMUNITY WHERE communityID = ?';
        }
        db.query(sql, [req.body.id], async function(err, result){
            if(err) return next(err);
            if(result == undefined || result.length < 1){
                const e = new Error();
                e.status = 404;
                e.message = 'Not Found';
                return next(e);
            }else{
                try{
            
                    let content = `<p>${req.body.userID}로부터 신고가 들어왔습니다.<br>
                                    글 제목 : ${result[0].title}<br>
                                    글 내용 : ${result[0].content}<br>
                                    카테고리 : ${result[0].category}<br>
                                    글작성자 : ${result[0].FK_COMMUNITY_userID}
                                    </p>`;  
            
                    let info = await transporter.sendMail({
                        from: `차박의 성지 <${process.env.emailUserID}>`,
                        to: 'chabaksg@gmail.com',//req.body.userID
                        subject: '[차박의성지]유저로부터 신고가 들어왔습니다',
                        html: content,
                    });
                    res.status(200).send('success');
            
                }catch(mail_error){
                    next(mail_error);
                }
            }
        })
    }
}

module.exports = {
    register : register,
    login : login,
    updateUserInfo : updateUserInfo,
    resetPassword : resetPassword,
    getBest : getBest,
    postReport : postReport
};