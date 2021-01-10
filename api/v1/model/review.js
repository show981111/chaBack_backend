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
            trim : true,
            escape : true
        },
        point : {
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
            errorMessage : 'point should be number',
            trim : true
        },
        imageKey : {
            optional : true,
            isArray : true,
            notEmpty: function(array) {
                return array.length > 0;
            },
            custom : {
                options : (array) => {
                    console.log(array);
                    if(array.length > 5){
                        throw new Error('out of range');
                    }else return array;
                }
            },
            errorMessage : 'imageKey should be array and max 5',
        },
        pointGap : {
            optional : !isUpdate,
            isNumeric : true,
            custom : {
                options : (value) => {
                    if(value >= -5 && value <= 5){//현재 - 과거 점수 
                         return value;
                    }else{
                        const e = new Error('pointGap out of range');
                        e.status = 400;
                        throw e;
                    }
                }
            },
            errorMessage : 'pointGap should be number',
            trim : true
        }
    });
}



module.exports = {
    reviewSchema : reviewSchema,
}