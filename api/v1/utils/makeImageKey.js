let convertImageList = function(imageList){
    if(imageList == undefined || imageList.length < 1){
        return undefined;
    }
    var imageKeyWithComma = imageList[0];
    for(var i = 1; i < imageList.length; i++){
        imageKeyWithComma += `,${imageList[i]}`;
    }
    return imageKeyWithComma;
}

module.exports = convertImageList;