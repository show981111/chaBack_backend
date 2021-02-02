module.exports = function(results, endpoint){
    for(var i = 0; i < results.length ; i++){
        var imageKeyArr = results[i].imageKey.split(',');
        var resizedImages = [];
        var originalImages = [];
        for(var j = 0; j < imageKeyArr.length; j++){
            if(!imageKeyArr[j] || imageKeyArr[j] == null) continue;
            var userID;
            if(endpoint == 'place')
            {
                userID = results[i].FK_PLACE_userID;
            }else if(endpoint == 'review'){
                userID = results[i].FK_REVIEW_userID;
            }else if(endpoint == 'gear'){
                userID = results[i].FK_GEAR_userID;
            }
            resizedImages.push(`${process.env.BUCKET_PATH}/images/resize/${userID}/${imageKeyArr[j]}`);
            originalImages.push(`${process.env.BUCKET_PATH}/images/original/${userID}/${imageKeyArr[j]}`);
        }
        results[i].resizedImages = resizedImages;
        results[i].originalImages = originalImages;
    }

    return results
}