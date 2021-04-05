const {checkSchema, check} = require('express-validator');

let communitiesSchema = function(isUpdate)
{ 
    return checkSchema({
        title : {
            notEmpty : true,
            isString : true,
            errorMessage : 'title should not be empty',
            trim : true,
        },
        content : {
            notEmpty : true,
            isString : true,
            errorMessage : 'content should not be empty',
            trim : true,
        },
        category : {
            optional : isUpdate,
            notEmpty : true,
            isNumeric : true,
            custom : {
                options : (value) => {
                    if(value == 0 || value == 1){
                        return true;                    
                    }else{
                        const e = new Error('invalid category');
                        e.status = 400;
                        throw e;
                    }
                }
            },
            trim : true
        },
        imageKey : {
            //optional : true,
            isArray : true,
            custom : {
                options : (value) => {
                    if(value.length > 5){
                        throw new Error('out of range');
                    }else{
                        for(var i = 0; i < value.length; i++){
                            var last = value[i].split("/");
                            value[i] = last[last.length - 1].split(".")[0].trim() + '.jpeg';
                            // value[i] = last[last.length - 1].trim();
                        }
                        return value;     
                    } 
                }
            },
            errorMessage: 'imageKey should be array',
        }
    });
}


module.exports = communitiesSchema;