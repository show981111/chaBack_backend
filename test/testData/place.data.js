let getPlaceInvalidProvider = [
    {
        'region' : 'z',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'before' : '2020-03-01',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : 'a',
        'category' : 'z',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'before' : '2020-03-01',
        exp : 400,
        detail : 'not in the list'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 3,
        'water' : 1,
        'price' : -1,
        'before' : '2020-03-01',
        exp : 400,
        detail : 'bathroom should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 3,
        'price' : -1,
        'before' : '2020-03-01',
        exp : 400,
        detail : 'water should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 1,
        'water' : 1,
        'price' : 3,
        'before' : '2020-03-01',
        exp : 400,
        detail : 'price should be 1, 0, -1'
    },
    {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 1,
        'water' : 1,
        'price' : -1,
        'before' : '2020-0301',
        exp : 400,
        detail : 'before should not be empty and be Date'
    },

]

module.exports = {
    getPlaceInvalidProvider: getPlaceInvalidProvider,
}