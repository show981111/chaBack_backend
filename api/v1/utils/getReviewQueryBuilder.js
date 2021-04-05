module.exports = function(userID ,option, params ,parseNum){

    var sql 
    var paramArray = []
    if(userID && userID != undefined)
    {
        paramArray = [userID];
        if(option === 'placeID'){
            sql = `SELECT A.*,B.userNickName,B.profileImg, IF(C.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN REVIEW_LIKE C ON C.FK_RLIKE_userID = ? AND A.reviewID = C.FK_RLIKE_reviewID
                    WHERE A.FK_REVIEW_placeID = ? order by reviewID DESC LIMIT ${params.page} , ${parseNum}`;
            paramArray.push(params.placeID);
        }else if(option === 'userID'){
            sql = `SELECT A.*,B.userNickName,B.profileImg, C.placeName, IF(D.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    LEFT JOIN REVIEW_LIKE D ON D.FK_RLIKE_userID = ? AND A.reviewID = D.FK_RLIKE_reviewID
                    WHERE FK_REVIEW_userID = ? order by reviewID DESC`;
            paramArray.push(params.userID);
        }else if(option =='rank'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName, IF(D.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    LEFT JOIN REVIEW_LIKE D ON D.FK_RLIKE_userID = ? AND A.reviewID = D.FK_RLIKE_reviewID
                    order by (A.likeCount + A.replyCount) DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='like'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName, IF(D.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    LEFT JOIN REVIEW_LIKE D ON D.FK_RLIKE_userID = ? AND A.reviewID = D.FK_RLIKE_reviewID
                    order by A.likeCount DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='point'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName, IF(D.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    LEFT JOIN REVIEW_LIKE D ON D.FK_RLIKE_userID = ? AND A.reviewID = D.FK_RLIKE_reviewID
                    order by A.point DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='best'){
            sql = `SELECT A.*,B.userNickName,B.profileImg, IF(C.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked, D.placeName FROM REVIEW A
                LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                LEFT JOIN REVIEW_LIKE C ON C.FK_RLIKE_userID = ? AND A.reviewID = C.FK_RLIKE_reviewID
                LEFT JOIN PLACE D ON A.FK_REVIEW_placeID = D.placeID
                WHERE A.FK_REVIEW_placeID = ? order by (A.likeCount + A.replyCount) DESC LIMIT ${params.page} , ${parseNum}`;
                paramArray.push(params.placeID);
        }
        else{
            sql = `SELECT A.*,B.userNickName,B.profileImg, C.placeName, IF(D.FK_RLIKE_userID IS NULL, 0 , 1) AS userLiked FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID 
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    LEFT JOIN REVIEW_LIKE D ON D.FK_RLIKE_userID = ? AND A.reviewID = D.FK_RLIKE_reviewID
                    order by reviewID DESC LIMIT ${params.page} , ${parseNum}`;
        }
    }else{
        if(option === 'placeID'){
            sql = `SELECT A.*,B.userNickName,B.profileImg FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    WHERE A.FK_REVIEW_placeID = ? order by reviewID DESC LIMIT ${params.page} , ${parseNum}`;
            paramArray.push(params.placeID);
        }else if(option === 'userID'){
            sql = `SELECT A.*,B.userNickName,B.profileImg, C.placeName FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    WHERE FK_REVIEW_userID = ? order by reviewID DESC`;
            paramArray.push(params.userID);
        }else if(option =='like'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    order by A.likeCount DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='point'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    order by A.point DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='rank'){
            sql = `SELECT A.*,B.userNickName,B.profileImg , C.placeName FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    order by (A.likeCount + A.replyCount) DESC LIMIT ${params.page} , ${parseNum}`;
        }else if(option =='best'){
            sql = `SELECT A.*,B.userNickName,B.profileImg, C.placeName FROM REVIEW A
                LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID
                LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                WHERE A.FK_REVIEW_placeID = ? order by (A.likeCount + A.replyCount) DESC LIMIT ${params.page} , ${parseNum}`;
                paramArray.push(params.placeID);
        }else{
            sql = `SELECT A.*,B.userNickName,B.profileImg, C.placeName FROM REVIEW A
                    LEFT JOIN USER B ON A.FK_REVIEW_userID = B.userID 
                    LEFT JOIN PLACE C ON A.FK_REVIEW_placeID = C.placeID
                    order by reviewID DESC LIMIT ${params.page} , ${parseNum}`;
        }
    }

    return {
        sql : sql,
        params : paramArray,
    }
}