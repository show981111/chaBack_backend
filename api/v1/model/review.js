const {checkSchema, check} = require('express-validator');

/**
 * 
 * @param {Boolean} isUpdate 
 */
let reviewSchema = function (isUpdate) {
    return checkSchema({
        placeID : {
            optional : isUpdate,
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
            custom : {
                options : (value) => {
                    if(value)
                    {
                        if(value.length > 5){
                            throw new Error('out of range');
                        }else{
                            for(var i = 0; i < value.length; i++){
                                var last = value[i].split("/");
                                value[i] = last[last.length - 1].split(".")[0].trim() + '.jpeg';
                            }
                            return value;
                        } 
                    }
                }
            },
            errorMessage : 'imageKey should be array and max 5',
        }
    });
}



module.exports = {
    reviewSchema : reviewSchema,
}