let postProvider = [
    {
        title : 'community post  0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        category : 0,
        imageKey : ['dasdsad', 'dsadas', 'asd'],
        exp : 200,
        detail : 'success'
    },
    {
        title : 'community post  0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        category : 1,
        imageKey : [],
        exp : 200,
        detail : 'success'
    },
    {
        title : 'community post  0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        category : 2,
        exp : 400,
        detail : 'invalid category'
    },
]

let putProvider = [
    {
        communityID : 1,
        title : 'community post to 0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        imageKey : ['updated Image ', 'dsadas', 'asd'],
        exp : 200,
        detail : 'success'
    },
    {
        communityID : 1,
        title : 'community post to 0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        exp : 200,
        detail : 'success'
    },
    {
        communityID : 'dasd',
        title : 'community post to 0',
        content : 'dasdasdasvaljlkMlkdn;e sad Fea vaevb e',
        exp : 400,
        detail : 'communityID should not be empty'
    },
]

let deleteProvider = [
    {
        communityID : -1,
        exp : 200,
        detail : 'success',
    },
    {
        communityID : 404,
        exp : 404,
        detail : 'row not found',
    }
]

l
module.exports = {
    postProvider : postProvider,
    putProvider : putProvider,
    deleteProvider : deleteProvider
}