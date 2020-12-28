const db = require('../../../dbConnection/mariaDB.js');
require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('../middleware/jwt.js');


let transporter = nodemailer.createTransport({
	// 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
	service: 'Naver',
	// host를 gmail로 설정
	host: 'smtp.naver.com',
	port: 587,
	secure: false,
	auth: {
	  // Gmail 주소 입력, 'testmail@gmail.com'
	  user: smtp_config.user,
	  // Gmail 패스워드 입력
	  pass: smtp_config.password,
	},
});

/**Send Email to User */
let postEmail = async function(req, res, next){
    const sql = 'SELECT * FROM USER WHERE userID = ?';
    db.query(sql, [req.body.userID], function(err, result){
        if(err) return next(err);
        if(result == undefined || result.length < 1){
            const e = new Error();
            e.status = 404;
            e.message = 'Not Found';
            return next(e);
        }
    })
    try{

        const verificationToken = await jwt.signJWT(req.body, "3m", "Email verification");

        let link="http://"+req.headers.host+"/api/v1/auth/email/verify/"+verificationToken;
        let html = `<p>이메일 인증을 위해서 <a href="${link}">LINK</a> 이 링크를 클릭해주세요! 인증 유효기간은 3분입니다!</p> `;

        let info = await transporter.sendMail({
            from: `"차박의 성지" <${smtp_config.user}>`,
            to: "show981111@gmail.com",//req.body.userID
            subject: '차박의 성지 이메일 인증',
            html: html,
        });
        res.status(200).send("success");

    }catch(mail_error){
        next(mail_error);
    }
}


module.exports = {
    postEmail : postEmail,
}