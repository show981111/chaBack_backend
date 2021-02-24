
let postProvider = [
    {
        content : `content for reply ${Date.now()}`,
        reviewID : 5,
        exp : 200,
        detail : 'post reply but no parent'
    },
    {
        content : `content for reply to 6 ${Date.now()}`,
        reviewID : 5,
        replyParentID : 6,
        exp : 200,
        detail : 'post reply as rereply'
    },
    {
        content : 312321,
        reviewID : 5,
        replyParentID : 6,
        exp : 400,
        detail : 'content should not be empty and be string'
    },
    {
        content : '21312312312',
        reviewID : 5,
        replyParentID : -1,
        exp : 404,
        detail : 'unable to find Foreign Key'
    },
    {
        content : '21312312312',
        reviewID : -1,
        replyParentID : 6,
        exp : 404,
        detail : 'unable to find Foreign Key'
    },
]

let putProvider = [
    {
        replyID : 8,
        content : `updated content for 8 ${Date.now()}`,
        exp : 200,
        detail : 'updated successfully'
    },
    {
        replyID : 9,
        content : `updated content for 8 `,
        exp : 404,
        detail : 'Not Found'
    },
    {
        replyID : 100,
        content : `updated content for 8 `,
        exp : 404,
        detail : 'Not Found'
    },
    {
        replyID : 'asdasd',
        content : `updated content for 8 `,
        exp : 400,
        detail : 'replyID should not be empty and be a number'
    }
]

let deleteProvider = [
    {
        replyID : 'asd',
        exp : 200,
        detail : 'deleted'
    },
    {
        replyID : 100,
        exp : 404,
        detail : 'Not Found'
    },
    {
        replyID : 'asdfda',
        exp : 400,
        detail : 'replyID should not be empty and be a number'
    }
]
module.exports = {
    postProvider : postProvider,
    putProvider : putProvider,
    deleteProvider : deleteProvider
}