let getPlaceInvalidProvider = [
    {
        'region' : '서울특별시',
        'category' : '어딘가',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'page' : 0,
        'option' : 'date',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : '어딘가',
        'category' : '노지',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'page' : 0,
        'option' : 'date',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : '서울특별시',
        'category' : '노지',
        'bathroom' : 3,
        'water' : 1,
        'price' : -1,
        'placeName' : -1,
        'page' : 0,
        'option' : 'date',
        exp : 400,
        detail : 'bathroom should be 1, 0, -1'
    },
    {
        'region' : '서울특별시',
        'category' : '노지',
        'bathroom' : 0,
        'water' : 3,
        'price' : -1,
        'placeName' : -1,
        'page' : 0,
        'option' : 'date',
        exp : 400,
        detail : 'water should be 1, 0, -1'
    },
    {
        'region' : '서울특별시',
        'category' : '노지',
        'bathroom' : 0,
        'water' : 1,
        'price' : 3,
        'placeName' : -1,
        'page' : 0,
        'option' : 'date',
        exp : 400,
        detail : 'price should be 1, 0, -1'
    },

]
//placeName, userID, lat, lng, address, region, content, category, bathroom, water, price, totalPoint, imageKey

let postProvier = [
    {
        placeName : 'adwads3',
        lat : 20.30020000,
        lng : 100.93254000,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 0,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 200
    },
    {
        placeName : 'adwads',
        lat : 28.30020000,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : '어디지',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '어디지',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 400,
        detail : 'not in the list'
    },
    {
        placeName : 'adwads',
        lat : 28.30020000,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 1,
        water : 4,
        price : 0,
        // point : 3,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 400,
        detail : 'water should be 1 or 0'
    },
    {
        placeName : 'adwads',
        lat : 100.3213123,
        lng : 116.93254000,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 1,
        water : 2,
        price : 0,
        // point : 3,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 400,
        detail : 'lat out of range'
    },
    {
        placeName : 'adwads',
        lat : 45.3213123,
        lng : 200.93254000,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 3,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 400,
        detail : 'lng out of range'
    },
    {
        placeName : 'adwads',
        lat : 81.7563000,
        lng : 41.9579,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 2,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
        exp : 403,
        detail : 'conflicted place'
    },
    {
        placeName : 'R8A 4Y8',
        lat : 80.7563000,
        lng : 167.9579,
        address : 'asdasdasd adsa dasd',
        region : '서울특별시',
        content : 'asdas dsad asd s sadsa dasd sadasd',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 0,
        // point : 2,
        imageKey : ['12a2da31dsa','1df213dsf42','fds23f1fds1sae'],
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
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 1,
        placeID : 1,
        imageKey : ['a','b','c','d','e'],
        detail : 'update place 1',
        exp : 200
    },
    {
        placeName : 'R8A 4Y8',
        content : 'N3Vdsadsa 4F7',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 1,
        exp : 409,
        imageKey : ['a','b','c','d','e'],
        placeID : 1,
        detail : 'placeName already exist'
    },
    {
        placeName : 'adwads',
        content : 'updated content',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 1,
        exp : 404,
        imageKey : ['a','b','c','d','e'],
        placeID : 106,
        detail : 'Not Found'
    },
    {
        placeName : 'adwads',
        content : 'updated content',
        category : '노지',
        bathroom : 1,
        water : 1,
        price : 1,
        imageKey : ['a','b','c','d','e'],
        exp : 404,
        placeID : 95,
        detail : 'Not Found'
    },
]

let deleteProvider = [
    {
        placeID : 80,
        imageKey : ['a','b','c'],
        exp : 404,
        detail : 'Not Found'
    },
    {
        placeID : 'sadasd',
        imageKey : ['a','b','c'],
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