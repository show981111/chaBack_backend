const { categoryList } = require("../model/place");

let filterQueryBuilder = function(region, category, bathroom, water , price, placeName ,before, standard, curlat, curlong) {//name 추가
    
    var sql = 'SELECT * FROM PLACE ';
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
        sql = `SELECT * , 
        (
            6371 *
            acos(cos(radians(?)) * 
            cos(radians(lat)) * 
            cos(radians(lng) - 
            radians(?)) + 
            sin(radians(?)) * 
            sin(radians(lat)))
        ) AS distance FROM PLACE `;
        paramArray.push(curlat);
        paramArray.push(curlong);
    }
    var common = `updated <= ? order by updated DESC LIMIT 20`;
    if(standard == 'point'){
        common = `meanPoint <= ? order by meanPoint DESC LIMIT 20`;
    }else if(standard == 'review'){
        common = `reviewCount <= ? order by reviewCount DESC LIMIT 20`;
    }else  if(standard == 'distance'){
        common = `distance <= ? order by distance DESC LIMIT 20`;//km 기준이다 
    }
    var where = 'WHERE ';

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
        where += 'AND ' + common;
    }else{
        where += common;
    }
    
    console.log(before);
    paramArray.push(before);
    sql = sql + where;

    return {
        sql : sql,
        params : paramArray
    }

}

let rankingQueryBuilder = function (reviewCount, point, before) {
    var sql = 'SELECT * FROM PLACE';
    var condition = '';
    if(reviewCount != undefined && reviewCount == 1){
        condition += 'reviewCount DESC'
    }

    if(point != undefined && point == 1){
        if(condition == ''){
            condition += '(totalPoint/reviewCount) DESC'
        }else{
            condition += ',(totalPoint/reviewCount) DESC'
        }
    }

    sql = sql + ' WHERE updated <= ? order by ' + condition + 'LIMIT 20';
    var params = [before];
    return {
        sql : sql,
        params : params
    }
}

module.exports = {
    filterQueryBuilder : filterQueryBuilder,
    rankingQueryBuilder : rankingQueryBuilder
}

