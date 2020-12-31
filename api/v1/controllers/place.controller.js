const db = require('../../../dbConnection/mariaDB.js');
const queryBuilder = require('../utils/filterQueryBuilder.js');

let getPlaceList = function(req, res, next){
    var sql = queryBuilder.filterQueryBuilder(req.params.region, req.params.category, 
        req.params.bathroom, req.params.water, req.params.price, req.params.before);
    console.log(sql);
    db.query(sql.sql, sql.params, function(err, results) {
        if(err) return next(err);
        console.log(this.sql);
        //console.log(results);
        res.status(200).send(results);
    })
}

let postPlace = function(req, res, next) {
    var sql = `INSERT INTO PLACE(placeName, userID, lat, lng, address, region, content, category, bathroom, water, price, totalPoint)
                VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`;
    var params = [req.body.placeName, req.body.userID, req.body.lat, req.body.lng, req.body.address,req.body.region,req.body.content,
                    req.body.category, req.body.bathroom,req.body.water,req.body.price,req.body.point];
    db.query(sql,params, function (err, results) {
        if(err) return next(err);
        console.log(results.insertId);
        if(results.affectedRows > 0){
            res.status(200).send('success')
        }else{
            next(new Error());
        }
    })
}
module.exports = {
    getPlaceList : getPlaceList,
    postPlace : postPlace
}