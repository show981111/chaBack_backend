const {checkSchema, check} = require('express-validator');

/**
 * 
 * @param {Boolean} isUpdate 
 */

const cat = [
    '차박텐트',
    '평탄화용품',
    '캠핑테이블',
    '캠핑의자',
    '캠핑매트',
    '캠핑조명',
    '캠핑식기',
    '캠핑BBQㆍ연료',
    '캠핑냉난방',
    '악세사리'
]

let gearSchema = checkSchema({
    title : {
        notEmpty : true,
        errorMessage : 'title should not be empty',
        trim : true
    },
    content : {
        notEmpty : true,
        isString : true,
        errorMessage : 'content should not be empty',
        trim : true,
        escape : true
    },
    category : {
        notEmpty : true,
        custom : {
            options : (value) => {
                for(var i = 0; i < cat.length; i++){
                    if(cat[i] == value){
                        return value;
                    }
                }
                const e = new Error('invalid category');
                e.status = 400;
                throw e;
            }
        },
        errorMessage : 'category should not be empty',
        trim : true
    },
    price : {
        notEmpty : true,
        isNumeric : true,
        errorMessage : 'price should not be empty',
        trim : true,
    },
    imageKey : {
        isArray : true,
        custom : {
            options : (value) => {
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
        },
        errorMessage: 'imageKey should be array',
    }
});


module.exports = {
    gearSchema : gearSchema,
};