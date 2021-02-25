const {checkSchema, check} = require('express-validator');

/**
 * 
 * @param {Boolean} isUpdate 
 */
let gearReviewSchema = function (isUpdate) {
    return checkSchema({
        gearID : {
            optional : isUpdate,
            notEmpty : true,
            isNumeric : true,
            errorMessage : 'gearID should be number',
            trim : true
        },
        content : {
            notEmpty : true,
            isString : true,
            errorMessage : 'content should be string',
            trim : true,
            escape : true
        },
        point : {
            errorMessage : 'point should be number',
            notEmpty : true,
            isNumeric : true,
            custom : {
                options : (value) => {
                    if(value >= 0 && value <= 5){
                         return value;
                    }else{
                        const e = new Error('point out of range');
                        e.status = 400;
                        throw e;
                    }
                }
            },
            trim : true
        }
    });
}

module.exports = gearReviewSchema;