const { categoryList } = require("../model/place");

let filterQueryBuilder = function(reqBody , query, before, standard, curlat, curlong) {//name 추가
    
    var sql = 'SELECT A.*, B.userNickName, B.profileImg FROM PLACE A ';
    var paramArray = [];
    var params = {
        'region' : reqBody.region,
        'category' : reqBody.category,
        'bathroom' : reqBody.bathroom,
        'water' : reqBody.water,
        'price' : reqBody.price,
        'hasMarket' : reqBody.hasMarket,
        'query' : query
        // 'placeName' : reqBody.placeName,
        // 'address' : reqBody.address
    };
    if(standard == 'distance'){
        sql = `SELECT A.*, B.userNickName, B.profileImg,
        (
            6371 *
            acos(cos(radians(?)) * 
            cos(radians(A.lat)) * 
            cos(radians(A.lng) - 
            radians(?)) + 
            sin(radians(?)) * 
            sin(radians(A.lat)))
        ) AS distance FROM PLACE A `;
        paramArray.push(curlat);
        paramArray.push(curlong);
        paramArray.push(curlat);
    }
    // var common = `placeID < ? order by placeID DESC LIMIT 20`;
    // if(standard == 'point'){
    //     common = `meanPoint < ? order by meanPoint DESC LIMIT 20`;
    // }else if(standard == 'review'){
    //     common = `reviewCount < ? order by reviewCount DESC LIMIT 20`;
    // }else if(standard == 'distance'){
    //     common = `HAVING distance < ? order by distance DESC LIMIT 20`;//km 기준이다 
    // }else if(standard == 'date'){
    //     common = `updated < ? order by updated DESC LIMIT 20`;
    // }
    var order = `order by placeID DESC LIMIT ${before} , 20`;
    if(standard == 'point'){
        order = `order by meanPoint DESC LIMIT ${before} ,20`;
    }else if(standard == 'review'){
        order = `order by reviewCount DESC LIMIT ${before} ,20`;
    }else if(standard == 'distance'){
        order = `order by distance DESC LIMIT ${before}, 20`;//km 기준이다 
        console.log(before);
    }else if(standard == 'date'){
        order = `order by updated DESC LIMIT ${before} ,20`;
    }
    var where = 'WHERE ';
    var join = 'JOIN USER B ON A.FK_PLACE_userID = B.userID ';
    var index = 0;
    var textCondition;
    // if(reqBody.placeName != undefined){
    //     textCondition = `(placeName = ${} OR )`
    // }else 
    for(var key in params){
        if(params[key]!== undefined && params[key] != -1 && params[key] != '-1'){
            console.log(key, params[key]);
            if(index != 0)
            {
                if(key == 'query'){
                    where += `AND (placeName like ? OR address like ?)`;
                }else where += `AND ${key} = ? `;
            }else {
                if(key == 'query'){
                    where += ` (placeName like ? OR address like ?) `;
                }else where += `${key} = ? `;
            }
            if(key == 'query'){
                 params[key] = '%'+params[key]+'%';
                 paramArray.push(params[key]);
                 paramArray.push(params[key]);
            }else{
                paramArray.push(params[key]);
            }
            index++;
        }
    }

    if(index != 0){
        // if(standard == 'distance'){
        //     where += ' ' + common;
        // }else{
        //     where += 'AND ' + common;
        // }
        where += ' ' + order;
    }else{
        // if(standard == 'distance'){
        //     where = common;
        // }else{
        //     where = common;
        // }
        where = order;
    }
    
    //paramArray.push(before);
    sql = sql + join +where;
    //console.log(sql);
    return {
        sql : sql,
        params : paramArray
    }

}

// let rankingQueryBuilder = function (reviewCount, point, before) {
//     var sql = 'SELECT * FROM PLACE';
//     var condition = '';
//     if(reviewCount != undefined && reviewCount == 1){
//         condition += 'reviewCount DESC'
//     }

//     if(point != undefined && point == 1){
//         if(condition == ''){
//             condition += '(totalPoint/reviewCount) DESC'
//         }else{
//             condition += ',(totalPoint/reviewCount) DESC'
//         }
//     }

//     sql = sql + ' WHERE updated <= ? order by ' + condition + 'LIMIT 20';
//     var params = [before];
//     return {
//         sql : sql,
//         params : params
//     }
// }

module.exports = {
    filterQueryBuilder : filterQueryBuilder,
    // rankingQueryBuilder : rankingQueryBuilder
}

