const { reject } = require('async');
const { sign } = require('crypto');
const jwt = require('jsonwebtoken');
const Promise = require('promise');
require('dotenv').config();

/* LOGIN */

let signJWT = function(userInfo, expIn, subject){
    console.log(Date.now());
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

var verifyToken = function(req, res, next){

    var rejected = new Error();
    rejected.status = 401;
    
	if(!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
        rejected.message = 'no credential';
		return next(rejected);
	}
	
	var token = req.headers.authorization;
	token = token.slice(7, token.length).trimLeft();
	
    jwt.verify(token, process.env.JWT_KEY, function(err, decoded) {
    	if(err) return next(err);
        
        req.token_userID = decoded.userID;
        next();
	});

}


module.exports = {
    signJWT : signJWT,
    verifyToken : verifyToken
}