const {checkSchema, check} = require('express-validator');

let realTimeSchema = checkSchema({
    content : {
        notEmpty : true,
        isString : true,
        errorMessage : 'content should not be empty',
        trim : true,
    },
    placeID : {
        notEmpty : true,
        isNumeric : true,
        trim : true,
        toInt : true,
        errorMessage : 'placeID should not be empty'
    }
});


module.exports = realTimeSchema;