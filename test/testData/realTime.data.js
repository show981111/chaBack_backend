let postProvier = [
    {
        placeID : 3,
        content : 'realtime data for place ID 3',
        exp : 200,
        detail : 'success',
    },
    {
        placeID : 2133,
        content : 'realtime data for place ID 3',
        exp : 404,
        detail : 'placeID Not Found',
    },
    {
        placeID : 'asdasd',
        content : 'realtime data for place ID 3',
        exp : 400,
        detail : 'placeID should not be empty',
    },

]

let putProvider = [
    {
        realTimeID : 3,
        content : 'update RealTime ',
        exp : 200,
        detail : 'success',
    },
    {
        realTimeID : 2133,
        content : 'realtime data for place ID 3',
        exp : 404,
        detail : 'row not found',
    },
    {
        realTimeID : 'asdasd',
        content : 'realtime data for place ID 3',
        exp : 400,
        detail : 'realTimeID should not be empty',
    },
]

let deleteProvider = [
    {
        realTimeID : 3,
        exp : 200,
        detail : 'success',
    },
    {
        realTimeID : 2133,
        content : 'realtime data for place ID 3',
        exp : 404,
        detail : 'row not found',
    },
    {
        realTimeID : 'asdasd',
        content : 'realtime data for place ID 3',
        exp : 400,
        detail : 'realTimeID should not be empty',
    },
]



module.exports = {
    postProvier : postProvier,
    putProvider : putProvider,
    deleteProvider : deleteProvider
}