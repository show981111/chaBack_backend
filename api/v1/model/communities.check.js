const {checkSchema, check} = require('express-validator');

const cat = [0, 1, 2]
let communitiesSchema = function(isCurrent)
{
    return checkSchema({
        title : {
            optional : isCurrent,
            notEmpty : true,
            isString : true,
            errorMessage : 'title should not be empty',
            trim : true,
            escape : true
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
                    if(isCurrent){
                        if(value != 2){
                            const e = new Error('invalid category');
                            e.status = 400;
                            throw e;
                        }
                    }else{
                        if(value != 0 && value != 1){
                            const e = new Error('invalid category');
                            e.status = 400;
                            throw e;
                        }
                    }

                    return value;                    
                }
            },
            errorMessage : 'category should not be empty',
            trim : true
        },
        placeID : {
            optional : !isCurrent,
            notEmpty : true,
            isNumeric : true,
            trim : true,
            toInt : true,
            errorMessage : 'placeID should not be empty'
        },
        placeName :{
            optional : !isCurrent,
            notEmpty : true,
            trim : true,
            errorMessage : 'placeName should not be empty'
        },
        imageKey : {
            optional : true,
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
}

module.exports = communitiesSchema;