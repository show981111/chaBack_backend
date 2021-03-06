const {validationResult} = require('express-validator');

var checkValidationResult = function(req, res, next){
    const errors = validationResult(req);
    if (errors != undefined && !errors.isEmpty()) {
        var error = new Error();
        error.status = 400;
        error.message = errors.array()[0].msg;
        next(error);
        return;
    }else{
        next();
    }
}

module.exports = checkValidationResult;