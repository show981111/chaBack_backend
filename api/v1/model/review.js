const {checkSchema, check} = require('express-validator');

/**
 * 
 * @param {Boolean} isUpdate 
 */
let reviewSchema = function (isUpdate) {
    return checkSchema({
        placeID : {
            // optional : isUpdate,
            notEmpty : true,
            isNumeric : true,
            errorMessage : 'placeID should be number',
            trim : true
        },
        content : {
            notEmpty : true,
            isString : true,
            errorMessage : 'content should be string',
            trim : true
        },
        point : {
            notEmpty : true,
            isNumeric : true,
            custom : {
                options : (value) => {
                    if(!isUpdate && value >= 0 && value <= 5){
                        return value;
                    }else if(isUpdate && value >= -5 && value <= 5){
                        return value;
                    }else{
                        const e = new Error('point out of range');
                        e.status = 400;
                        throw e;
                    }
                }
            },
            errorMessage : 'point should be number',
            trim : true
        },
        imageKey : {
            optional : true,
            notEmpty : true,
            isLength : {
                options: { max: 300 },
            },
            errorMessage : 'imageKey should not be empty and max 300 chars',
            trim : true
        },
        
    });
}



module.exports = {
    reviewSchema : reviewSchema,
}