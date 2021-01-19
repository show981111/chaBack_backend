const { reject } = require('async');
const { sign } = require('crypto');
const jwt = require('jsonwebtoken');
const Promise = require('promise');
require('dotenv').config();

/* LOGIN */

let signJWT = function(userInfo, expIn, subject){
    return new Promise((resolve, reject) => {
        jwt.sign({
            userID: userInfo.userID,
            iat : Math.floor(Date.now() / 1000)
        }, 
        process.env.JWT_KEY, 
        {
            expiresIn: expIn,
            issuer: 'chaback',
            subject: subject,
        }, 
        function(err, token) {
            if(err){reject(err)}
            resolve(token);
        }
    )});
}


let verifyToken = function(role){ 

    return function(req, res, next){
        var token;
        var rejected = new Error('no credential');
        rejected.status = 401;
        if(role == 'refreshToken'){
            token = req.body.refreshToken;
        }else{
            if(!req.headers.authorization|| req.headers.authorization == undefined || !req.headers.authorization.startsWith('Bearer ')) {
                return next(rejected);
            }
            
            token = req.headers.authorization;
            token = token.slice(7, token.length).trimLeft();
        }
        if(!token || token == ''){return next(rejected)}

        jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
            if(err) {
                if(err.name === 'TokenExpiredError'){
                    var e = new Error();
                    e.status = 401;
                    e.message = 'Token Expired';
                    return next(e); 
                }else{
                    console.log(token);
                    console.log(err);
                    return next(err); 
                }
            }
            
            if(role == undefined){
                role = 'accessToken';
            }
            if(decoded.sub == role && decoded.userID != undefined){
                req.token_userID = decoded.userID;
                next();
            }else{
                console.log('Wrong Token ' + decoded.sub);
                var e = new Error();
                e.status = 401;
                e.message = 'Wrong Token';
                return next(e); 
            }
        });
    }
}

let verifyEmailVerification = function(req, res, next){
    
    if(req.params.token == undefined){
        e.message = 'no credential';
        return next(e);
    }
    const token = req.params.token;
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
    	if(err) { 
            console.log(err);
            if(err.name === 'TokenExpiredError'){
                var e = new Error();
                e.status = 401;
                e.message = 'Token Expired';
                return next(e); 
            }else{
                return next(err); 
            }
        }

        
        if(decoded.sub == 'Email verification')
        {
            req.token_userID = decoded.userID;
            next();
        }else{
            var e = new Error();
            e.status = 401;
            e.message = 'Wrong Token';
            return next(e);
        }
	});
}



module.exports = {
    signJWT : signJWT,
    verifyToken : verifyToken,
    verifyEmailVerification : verifyEmailVerification
}