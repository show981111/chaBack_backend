const { categoryList } = require("../model/place");

let filterQueryBuilder = function(region, category, bathroom, water , price, placeName ,before, standard, curlat, curlong) {//name 추가
    
    var sql = 'SELECT A.*, B.userNickName, B.profileImg FROM PLACE A ';
    var paramArray = [];
    var params = {
        'region' : region,
        'category' : category,
        'bathroom' : bathroom,
        'water' : water,
        'price' : price,
        'placeName' : placeName
    };
    console.log(placeName);
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
    var common = `order by placeID DESC LIMIT ${before} , 20`;
    if(standard == 'point'){
        common = `order by meanPoint DESC LIMIT ${before} ,20`;
    }else if(standard == 'review'){
        common = `order by reviewCount DESC LIMIT ${before} ,20`;
    }else if(standard == 'distance'){
        common = `order by distance DESC LIMIT ${before}, 20`;//km 기준이다 
        console.log(before);
    }else if(standard == 'date'){
        common = `order by updated DESC LIMIT ${before} ,20`;
    }
    var where = 'WHERE ';
    var join = 'JOIN USER B ON A.FK_PLACE_userID = B.userID ';
    var index = 0;
    for(var key in params){
        if(params[key]!= undefined && params[key] != -1 && params[key] != '-1'){
            if(index != 0)
            {
                if(key == 'placeName'){
                    where += `AND ${key} like ? `;
                }else where += `AND ${key} = ? `;
            }else {
                if(key == 'placeName'){
                    where += ` ${key} like ? `;
                }else where += `${key} = ? `;
            }
            if(key == 'placeName') params[key] = '%'+params[key]+'%';
            paramArray.push(params[key]);
            index++;
        }
    }

    if(index != 0){
        // if(standard == 'distance'){
        //     where += ' ' + common;
        // }else{
        //     where += 'AND ' + common;
        // }
        where += ' ' + common;
    }else{
        // if(standard == 'distance'){
        //     where = common;
        // }else{
        //     where = common;
        // }
        where = common;
    }
    
    //paramArray.push(before);
    sql = sql + join +where;

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

