const { categoryList } = require("../model/place");

let filterQueryBuilder = function(region, category, bathroom, water , price ,before) {
    
    var sql = 'SELECT * FROM PLACE ';
    var common = `updated <= ? order by updated DESC LIMIT 20`;
    var where = 'WHERE ';
    var paramArray = [];
    var params = {
        'region' : region,
        'category' : category,
        'bathroom' : bathroom,
        'water' : water,
        'price' : price,
    };

    var index = 0;
    for(var key in params){
        if(params[key]!= undefined && params[key] != -1){
            if(index != 0)
            {
                where += `AND ${key} = ? `;
            }else where += `${key} = ? `;
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

