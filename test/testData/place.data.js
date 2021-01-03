let getPlaceInvalidProvider = [
    {
        'region' : 'z',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'before' : '2019-05-01',
        'option' : 'date',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : 'a',
        'category' : 'z',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'before' : '2019-05-01',
        'option' : 'date',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 3,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'before' : '2019-05-01',
        'option' : 'date',
        exp : 400,
        detail : 'bathroom should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 3,
        'price' : -1,
        'placeName' : -1,
        'before' : '2019-05-01',
        'option' : 'date',
        exp : 400,
        detail : 'water should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 1,
        'price' : 3,
        'placeName' : -1,
        'before' : '2019-05-01',
        'option' : 'date',
        exp : 400,
        detail : 'price should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'before' : '2019-0501',
        'option' : 'date',
        exp : 400,
        detail : 'before should not be empty and be Date'
    },

]
//placeName, userID, lat, lng, address, region, content, category, bathroom, water, price, totalPoint, imageKey

let postProvier = [
    {
        placeName : 'adwads3',
        lat : 20.30020000,
        lng : 100.93254000,
        address : 'asdasdasd adsa dasd',
        region : 'c',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 0,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 200
    },
    {
        placeName : 'adwads',
        lat : 28.30020000,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : 'z',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 400,
        detail : 'not in the list'
    },
    {
        placeName : 'adwads',
        lat : 28.30020000,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : 'a',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 4,
        price : 0,
        // point : 3,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 400,
        detail : 'water should be 1 or 0'
    },
    {
        placeName : 'adwads',
        lat : 100.3213123,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : 'a',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 2,
        price : 0,
        // point : 3,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 400,
        detail : 'lat out of range'
    },
    {
        placeName : 'adwads',
        lat : 45.3213123,
        lng : 200.93254000,
        address : 'asdasdasd adsa dasd',
        region : 'a',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 400,
        detail : 'lng out of range'
    },
    {
        placeName : 'adwads',
        lat : 81.7563000,
        lng : 41.9579,
        address : 'asdasdasd adsa dasd',
        region : 'g',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 2,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 409,
        detail : 'conflicted place'
    },
    {
        placeName : 'B1K 1J3',
        lat : 12.7563000,
        lng : 41.9579,
        address : 'asdasdasd adsa dasd',
        region : 'g',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : 'b',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 2,
        imageKey : '12a2da31dsa,1df213dsf42,fds23f1fds1sae',
        exp : 409,
        detail : 'placeName already exist'
    },
]

// req.body.placeName, req.token_userID, req.body.content,req.body.category,
//             req.body.bathroom,req.body.water,req.body.price, req.params.placeID, req.token_userID
let placeUpdateProvider = [
    {
        placeName : 'updated Place Name ',
        content : 'updated content',
        category : 'd',
        bathroom : 1,
        water : 1,
        price : 1,
        placeID : 105,
        imageKey : 'a,b,c,d,e',
        detail : 'update place 105',
        exp : 200
    },
    {
        placeName : 'adwads',
        content : 'updated content',
        category : 'd',
        bathroom : 1,
        water : 1,
        price : 1,
        exp : 409,
        imageKey : 'a,b,c,d,e',
        placeID : 105,
        detail : 'placeName already exist'
    },
    {
        placeName : 'adwads',
        content : 'updated content',
        category : 'd',
        bathroom : 1,
        water : 1,
        price : 1,
        exp : 404,
        imageKey : 'a,b,c,d,e',
        placeID : 106,
        detail : 'Not Found'
    },
    {
        placeName : 'adwads',
        content : 'updated content',
        category : 'd',
        bathroom : 1,
        water : 1,
        price : 1,
        imageKey : 'a,b,c,d,e',
        exp : 404,
        placeID : 95,
        detail : 'Not Found'
    },
]

let deleteProvider = [
    {
        placeID : 80,
        exp : 404,
        detail : 'Not Found'
    },
    {
        placeID : 'sadasd',
        exp : 400,
        detail : 'placeID should be number and not be empty'
    }
]
module.exports = {
    getPlaceInvalidProvider: getPlaceInvalidProvider,
    postProvier : postProvier,
    placeUpdateProvider : placeUpdateProvider,
    deleteProvider : deleteProvider
}