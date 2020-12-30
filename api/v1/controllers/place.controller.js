const db = require('../../../dbConnection/mariaDB.js');

let getPlaceList = function(filter){
    return function(req, res, next){
        var sql;
        if(filter == 'region'){
            sql = 'SELECT * FROM PLACE WHERE region = ? order by updated DESC';
        }else if(filter == 'category'){
            sql = 'SELECT * FROM PLACE WHERE category = ? order by updated DESC';
        }else if(filter == 'placeName'){
            sql = 'SELECT * FROM PLACE order by updated DESC';
        }else{
            sql = 'SELECT * FROM PLACE WHERE placeName LIKE ? ';
        }
    }
}