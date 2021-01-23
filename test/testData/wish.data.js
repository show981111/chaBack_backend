let wishProvider = [
    {
        placeID : 4,
        exp : 200,
        detail : 'success'
    },
    {
        placeID : 23,
        exp : 204,
        detail : 'id should not be empty and be a number'
    },
    {
        placeID : 'sadas',
        exp : 400,
        detail : 'id should not be empty and be a number'
    },
    {
        placeID : 412,
        exp : 404,
        detail : 'ID Not Found'
    },
]



module.exports = {
    wishProvider : wishProvider,
}