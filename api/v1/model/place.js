const {checkSchema, check} = require('express-validator');

const regionData = [ 
    '서울특별시',
    '경기도',
    '부산광역시',
    '대구광역시',
    '인천광역시',
    '광주광역시',
    '대전광역시',
    '울산광역시',
    '세종특별자치시',
    '강원도',
    '충청북도',
    '충청남도',
    '전라북도',
    '전라남도',
    '경상북도',
    '경상남도',
    '제주특별자치도',
    -1
]

// const regionData = ['a','b','c','d','e','f','g','h', -1]
const nearRegion = {
    '서울특별시' : ['서울특별시', '경기도', '인천광역시'],
    '경기도' : ['경기도', '서울특별시', '인천광역시'],
    '부산광역시' : ['부산광역시', '경상북도','경상남도'],
    '대구광역시' : ['대구광역시', '경상북도','경상남도'],
    '인천광역시' : ['인천광역시', '경기도', '서울특별시'],
    '광주광역시' : ['광주광역시'],
    '대전광역시' : ['대전광역시'],
    '울산광역시' : ['울산광역시'],
    '세종특별자치시' : ['세종특별자치시'],
    '강원도' : ['강원도'],
    '충청북도' : ['충청북도'],
    '충청남도' : ['충청남도'],
    '전라북도' : ['전라북도'],
    '전라남도' : ['전라남도'],
    '경상북도' : ['경상북도'],
    '경상남도' : ['경상남도'],
    '제주특별자치도' : ['제주특별자치도'],
}

const categoryList = ['노지',  '캠핑장', '주차장' , '도로변',  '사유지' , -1]

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

var placeSchema = function(optional){
  return checkSchema({
    placeName: {
        errorMessage: 'placeName should not be empty',
        notEmpty : true, 
        trim: true,
    },
    // userID: {
    //     errorMessage: 'userID should not be empty and should be email',
    //     notEmpty : true, 
    //     isEmail : true, 
    //     trim: true
    // },
    lat: {
        errorMessage: 'lat should not be empty and should be decimal',
        optional : optional,
        notEmpty : true, 
        isDecimal : true, 
        isFloat : { 
            options: { min : -90 , max: 90 },
            errorMessage : 'lat out of range'
        },
        trim: true
    },
    lng: {
        errorMessage: 'lng should not be empty and should be decimal',
        optional : optional,
        notEmpty : true, 
        isDecimal : true, 
        isFloat : { 
            options: { min : -180 , max: 180 },
            errorMessage : 'lng out of range'
        },
        trim: true
    },
    address: {
        errorMessage: 'address should not be empty',
        optional : optional,
        notEmpty : true, 
        trim: true
    },
    region: {
        errorMessage: 'region should not be empty',
        optional : optional,
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
        trim: true,
    },
    content: {
        errorMessage: 'content should not be empty and max length is 200',
        isLength : {
            options: { max: 200 },
        },
        notEmpty : true,
        trim : true,
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
        trim : true,
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
        errorMessage: 'price should be 1 or 0',
        isBoolean : true,
        notEmpty : true,
        trim : true
    },
    hasMarket: {
        errorMessage: 'hasMarket should be 1 or 0',
        isBoolean : true,
        notEmpty : true,
        trim : true
    },
    imageKey : {
        optional : true,
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
        errorMessage: 'imageKey should be array and max 5',
    }
});
}

var placeCommonFilterSchema = checkSchema({
    region: {
        optional : true,
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
    category: {
        optional : true,
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
        optional : true,
        errorMessage: 'bathroom should be 1, 0, -1',
        notEmpty : true,
        custom : {
            options : (value) => {
                if(value == 0 || value == 1 || value == -1){
                    return true;
                }else{
                    const e = new Error('bathroom should be 1, 0, -1');
                    e.status = 400;
                    throw e;
                }
            },
        },  
        trim : true
    },
    water: {
        optional : true,
        errorMessage: 'water should be 1, 0, -1',
        notEmpty : true,
        custom : {
            options : (value) => {
                if(value == 0 || value == 1 || value == -1){
                    return true;
                }else{
                    const e = new Error('water should be 1, 0, -1');
                    e.status = 400;
                    throw e;
                }
            },
        },  
        trim : true
    },
    price: {
        optional : true,
        errorMessage: 'price should be 1, 0, -1',
        notEmpty : true,
        custom : {
            options : (value) => {
                if(value == 0 || value == 1 || value == -1){
                    return true;
                }else{
                    const e = new Error('price should be 1, 0, -1');
                    e.status = 400;
                    throw e;
                }
            },
        },  
        trim : true
    },
    hasMarket: {
        optional : true,
        errorMessage: 'hasMarket should be 1, 0, -1',
        notEmpty : true,
        custom : {
            options : (value) => {
                if(value == 0 || value == 1 || value == -1){
                    return true;
                }else{
                    const e = new Error('price should be 1, 0, -1');
                    e.status = 400;
                    throw e;
                }
            },
        },  
        trim : true
    },
    query: {
        optional : true,
        errorMessage: 'query should not be empty',
        notEmpty : true,
        trim : true
    }
});

var optionSchema = checkSchema({
    option : {
        custom : {
            options : (value) => {
                if(value == 'point'|| value == 'review' || value == 'date' || value == 'id' ){
                    return value;
                }else{
                    const e = new Error('option should be point, review, date, id');
                    e.status = 400;
                    throw e;
                }
            },
        },  
    },
    page : {
        notEmpty : true,
        isNumeric : true,
        withMessage : 'page should be number'
    }
    // before : {
    //     notEmpty : true,
    //     custom : {
    //         options : (value , {req}) => {
    //             if(req.params.option == 'date'){
    //                 if(isNaN(Date.parse(value))){
    //                     console.log(Date.parse(value));
    //                     const e = new Error('before should not be empty and be Date');
    //                     e.status = 400;
    //                     throw e;
    //                 }else return value;
    //             }else if(req.params.option == 'review' || req.params.option == 'point' || req.params.option == 'id'){
    //                 if(!isNaN(value)){
    //                     return value;
    //                 }else{
    //                     const e = new Error('before should be number');
    //                     e.status = 400;
    //                     throw e;
    //                 }
    //             }else{
    //                 const e = new Error('option should be point, review, date, id');
    //                 e.status = 400;
    //                 throw e;
    //             }
                
    //         },
    //     }
    // },
});

module.exports = {
    placeSchema : placeSchema,
    filter : filter,
    optionSchema : optionSchema,
    placeCommonFilterSchema : placeCommonFilterSchema,
    categoryList : categoryList,
    regionData : regionData,
    nearRegion : nearRegion,
};