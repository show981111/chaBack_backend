
let reviewPostProvider = [
    {
        placeID : 2,
        content : 'post review to place ID 2 ',
        point : 3,
        imageKey : ['a','b','c'],
        exp : 200,
        detail : "post review successfully" 
    },
    {
        placeID : 'asd',
        content : 'post review to place ID 2 ',
        point : 3,
        imageKey : ['a','b','c'],
        exp : 400,
        detail : "placeID should be number" 
    },
    {
        placeID : 2,
        content : 'post review to place ID 2 ',
        point : 6,
        imageKey : ['a','b','c'],
        exp : 400,
        detail : "point out of range" 
    },
    {
        placeID : 2,
        content : 'post review to place ID 2 ',
        point : 3,
        imageKey : 'a,b,c',
        exp : 400,
        detail : "imageKey should be array and max 5" 
    },
    {
        placeID : 2,
        content : 'post review to place ID 2 ',
        point : 3,
        imageKey : ['1','2','3','4','5','6','7'],
        exp : 400,
        detail : "out of range" 
    },
    {
        placeID : 300,
        content : 'post review to place ID 2 ',
        point : 3,
        imageKey : ['1','2','3','4'],
        exp : 404,
        detail : "placeID Not Found" 
    },

]

//UPDATE REVIEW SET content = ?, updated = ?, point = ?, imageKey = ?
//WHERE FK_REVIEW_userID = ? AND reviewID = ?`;

let reviewPutProvider = [
    {
        reviewID : 5,
        content : 'updated content haha',
        point : 5,
        imageKey : ['asdasd','vasgrae','hdhydth'],
        exp : 200,
        detail : 'update 5 successfully'
    },
    {
        reviewID : 2,
        content : 'updated content haha',
        point : 5,
        imageKey : ['asdasd','vasgrae','hdhydth'],
        exp : 404,
        detail : 'Not Found'
    }
]

let reviewDeleteProvider = [
    {
        reviewID : 3,
        exp : 200,
        detail : 'delete review successfully'
    },
    {
        reviewID : 989,
        exp : 404,
        detail : 'Not Found'//due to reviewID and userID is not matching
    }
]



module.exports = {
    reviewPostProvider : reviewPostProvider,
    reviewPutProvider : reviewPutProvider,
    reviewDeleteProvider : reviewDeleteProvider
}