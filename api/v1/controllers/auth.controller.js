const db = require('../../../dbConnection/mariaDB.js');
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('../middleware/jwt.js');


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
let postEmail = function(req, res, next){
    const sql = 'SELECT * FROM USER WHERE userID = ?';
    db.query(sql, [req.body.userID], async function(err, result){
        if(err) return next(err);
        if(result == undefined || result.length < 1){
            const e = new Error();
            e.status = 404;
            e.message = 'Not Found';
            return next(e);
        }else{
            try{

                const verificationToken = await jwt.signJWT(req.body, "3m", "Email verification");
        
                let link="http://"+req.headers.host+"/api/v1/auth/email/verify/"+verificationToken;
                let html = `<p>이메일 인증을 위해서 <a href="${link}">LINK</a> 이 링크를 클릭해주세요! 인증 유효기간은 3분입니다!</p> `;
        
                let info = await transporter.sendMail({
                    from: `차박의 성지 <${process.env.emailUserID}>`,
                    to: req.body.userID,//req.body.userID
                    subject: '차박의 성지 이메일 인증',
                    html: html,
                });
                res.status(200).send({token : verificationToken});
        
            }catch(mail_error){
                next(mail_error);
            }
        }
    })
}

let verifyUser = function(req,res, next){
    const sql = 'INSERT INTO VERIFICATION(userID, verifiedAt) VALUES(?, ?) ON DUPLICATE KEY UPDATE verifiedAt = ? ';
    const params = [req.token_userID, Math.floor(Date.now() / 1000), Math.floor(Date.now() / 1000) ];
    db.query(sql,params, function(err, result){
        if(err) return next(err);
        
        console.log(result);
        if(result.affectedRows > 0){
            res.status(200).send("성공적으로 인증되었습니다. 앱에서 계속 진행해주세요.");
        }else{
            const e = new Error();
            next(e);
        }
    })
}

let authLogin = function(req, res, next){
    const sql = 'SELECT userID, userNickName, userName, userPhone, profileImg, isAdmin FROM USER WHERE userID = ? ';
    db.query(sql, [req.token_userID], function(err, result){
        if(err) return next(err);

        if(result != undefined && result.length > 0){
            res.status(200).send(result[0]);
        }else{
            const e = new Error();
            e.status = 404;
            e.message = "Not Found";
            next(e);
        }
    })
}

let issueNewAccessToken = function(req, res, next){
    const sql = 'SELECT * FROM USER WHERE refreshToken = ?';
    // var token = req.headers.authorization;
    // token = token.slice(7, token.length).trimLeft();
    
    db.query(sql , [req.body.refreshToken],async function(err, result){
        if(err) {console.log(err); return next(err);}

        if(result != undefined && result.length > 0){
            const userInfo = {userID : req.token_userID, userNickName : req.token_userNickName};
            const newAccessToken = await jwt.signJWT(userInfo, '15m', 'accessToken');
            res.status(200).send({accessToken : newAccessToken});

        }else{
            const e = new Error();
            e.status = 404;
            e.message = "Token and userID pair was not found";
            next(e);
        }
    })
}


module.exports = {
    postEmail : postEmail,
    verifyUser : verifyUser,
    authLogin : authLogin,
    issueNewAccessToken : issueNewAccessToken
}