let gearPostProvider = [//title, content, category ,imageKey
    {
        title : 'chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'c',
        price : 100,
        imageKey : ['asd  ','fds .jpg  '],
        exp : 200,
        detail : 'success'
    },
    {
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'c',
        imageKey : ['asd','fds'],
        exp : 400,
        price : 100,
        detail : 'title should not be empty'
    },
    {
        title : 'chaBack tent',
        category : 'c',
        price : 100,
        imageKey : ['asd','fds'],
        exp : 400,
        detail : 'content should not be empty'
    },
    {
        title : 'chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        price : 100,
        imageKey : ['asd','fds'],
        exp : 400,
        detail : 'category should not be empty'
    },
    {
        title : 'chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'dsadsa',
        price : 100,
        imageKey : ['asd','fds'],
        exp : 400,
        detail : 'invalid category'
    },
    {
        title : 'chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'c',
        price : 100,
        exp : 400,
        detail : 'imageKey should be array'
    },
]

let gearPutProvider = [//title, content, category ,imageKey
    {
        gearID : 3,
        title : 'updated chaBack tent',
        content : 'updated content ',
        category : 'd',
        price : 200,
        imageKey : ['updated  ','updated2 .jpg  '],
        exp : 200,
        detail : 'success'
    },
    {
        title : 'updated chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'c',
        price : 200,
        imageKey : ['asd','fds'],
        exp : 400,
        detail : 'gearID should not be empty'
    },
    {
        gearID : 100,
        title : 'updated chaBack tent',
        content : 'dasdasdasdasdasdasdasdsadasdasdasas',
        category : 'c',
        price : 200,
        imageKey : ['asd','fds'],
        exp : 404,
        detail : 'Not Found'
    },
   
]

let gearDeleteProvider = [//title, content, category ,imageKey
    {
        gearID : 2,
        exp : 200,
        detail : 'success'
    },
    {
        exp : 400,
        detail : 'gearID should not be empty'
    },
    {
        gearID : 123,
        exp : 404,
        detail : 'Not Found'
    },
   
]

module.exports = {
    gearPostProvider : gearPostProvider,
    gearPutProvider : gearPutProvider,
    gearDeleteProvider : gearDeleteProvider
}