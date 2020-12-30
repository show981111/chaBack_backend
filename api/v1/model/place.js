const {checkSchema} = require('express-validator');
const { options } = require('superagent');

const regionData = ['서울특별시','부산광역시','대구광역시','인천광역시','광주광역시','대전광역시','울산광역시','경기도',
'강원도','충청북도','충청남도','전라북도','전라남도','경상북도','경상남도','제주도','세종시']

const categoryList = ['a','b','c','d','e']

let filter = function(value, data){
    for(var i = 0; i < data.length; i++){
        if(data[i] == value){
            return value;
        }
    }
    const err = new Error('not in the list');
    err.status = 400;
    throw err;
}

var placeSchema = checkSchema({
    placeName: {
        errorMessage: 'placeName should not be empty',
        notEmpty : true, 
        trim: true
    },
    userID: {
        errorMessage: 'userID should not be empty and should be email',
        notEmpty : true, 
        isEmail : true, 
        trim: true
    },
    lat: {
        errorMessage: 'lat should not be empty and should be decimal',
        notEmpty : true, 
        isLatLong : true, 
        trim: true
    },
    lng: {
        errorMessage: 'lng should not be empty and should be decimal',
        notEmpty : true, 
        isLatLong : true, 
        trim: true
    },
    address: {
        errorMessage: 'address should not be empty',
        notEmpty : true, 
        trim: true
    },
    region: {
        errorMessage: 'region should not be empty',
        notEmpty : true, 
        custom : {
            options : (value) => {
                try{
                    return filter(value, regionData);
                }catch(err){
                    throw err;
                }
            },
        },  
        trim: true
    },
    content: {
        errorMessage: 'content should not be empty and max length is 200',
        isLength : {
            options: { max: 200 },
        },
        notEmpty : true,
        trim : true
    },
    category: {
        errorMessage: 'category should not be empty',
        notEmpty : true,
        custom : {
            options : (value) => {
                try{
                    return filter(value, categoryList);
                }catch(err){
                    throw err;
                }
            },
        },  
        trim : true
    },
    bathroom: {
        errorMessage: 'bathroom should be 1 or 0',
        isBoolean : true,
        notEmpty : true,
        trim : true
    },
    water: {
        errorMessage: 'water should be 1 or 0',
        isBoolean : true,
        notEmpty : true,
        trim : true
    },
    price: {
        errorMessage: 'price should not be number',
        isNumeric : true,
        notEmpty : true,
        trim : true
    },
    point: {
        errorMessage: 'point should be 0 to 5',
        isNumeric : true,
        notEmpty : true,
        custom : {
            options : (value) => {
                if(value >= 0 && value <= 5) return value;

                const err = new Error('point should be 0 to 5');
                err.status = 400;
                throw err;
            },
        },
        trim : true
    }
});

module.exports = {
    placeSchema : placeSchema,
    filter : filter,
    categoryList : categoryList,
    regionData : regionData
};