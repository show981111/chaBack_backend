const {checkSchema, check} = require('express-validator');

/**
 * 
 * @param {Boolean} isUpdate 
 */

const cat = ['a','b','c','d']

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
    imageKey : {
        notEmpty: function(array) {
            return array.length > 0;
        },
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