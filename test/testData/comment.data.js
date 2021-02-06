let postProvider = [
    {
        communityID : 5,
        content : 'comment to communityID',
        exp : 200,
        detail : 'success',
    },
    {
        communityID : 404,
        content : 'comment to communityID',
        exp : 404,
        detail : 'unable to find Foreign Key',
    },
    {
        communityID : 'ㅁㄴㅇㅁㄴ',
        content : 'comment to communityID',
        exp : 400,
        detail : 'communityID should not be empty',
    }
]

let putProvider = [
    {
        commentID : 1,
        content : 'updated content',
        exp : 200,
        detail : 'success',
    },
    {
        commentID : 'dsadsa',
        content : 'updated content',
        exp : 400,
        detail : 'commentID should not be empty',
    },
    {
        commentID : 404,
        content : 'updated content',
        exp : 404,
        detail : 'row not found',
    }
]

module.exports = {
    postProvider : postProvider,
    putProvider : putProvider
}