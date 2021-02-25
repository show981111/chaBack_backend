let postProvider = [
    {
        gearID : 3,
        point : 4,
        content : 'this is review to gearID 3',
        exp : 200,
        detail : 'success'
    },
    {
        point : 4,
        content : 'this is review to gearID 3',
        exp : 400,
        detail : 'gearID should be number'
    },
    {
        gearID : 3,
        point : 'dsadasdas',
        content : 'this is review to gearID 3',
        exp : 400,
        detail : 'point should be number'
    },
    {
        gearID : 4,
        point : 8,
        content : 'this is review to gearID 3',
        exp : 400,
        detail : 'point out of range'
    },
    {
        gearID : 432,
        point : 4,
        content : 'this is review to gearID 432',
        exp : 404,
        detail : 'unable to find Foreign Key'
    },
]

let putProvider = [
    {
        gearReviewID : 2,
        point : 5,
        content : 'update the review content of 2',
        exp : 200,
        detail : 'success'
    },
    {
        gearReviewID : 543,
        point : 3,
        content : 'update the review content of 2',
        exp : 404,
        detail : 'Not Found'
    },
]

let deleteProvider = [
    {
        gearReviewID : 543,
        exp : 200,
        detail : 'success',
    },
    {
        gearReviewID : 543,
        exp : 404,
        detail : 'Not Found',
    },
]
module.exports = {
    postProvider : postProvider,
    putProvider : putProvider,
    deleteProvider : deleteProvider
}