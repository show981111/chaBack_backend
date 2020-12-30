let sendEmailInvalidInput = [
    {
        userID : 'notexist@gmail.com',
        detail : 'user does not exist',
        exp : 404
    },
    {
        userID : 'notexist@gmailcom',
        detail : 'Invalid user Email',
        exp : 400
    },
    {
        detail : 'userID does not exist',
        exp : 400
    },
]

let invalidToken = [
    {
        token : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJva0BnbWFpbC5jb20iLCJpYXQiOjE2MDkyMDk4NDgsImV4cCI6MTYwOTIxMDc0OCwiaXNzIjoiY2hhYmFjayIsInN1YiI6ImFjY2Vzc1Rva2VuIn0.8JX8_rIkfszkHxKIndAVlKbLakUq_2kMdXvx9O2FT80`,
        detail : 'Token Expired',
        exp : 401
    },
    {
        token : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJva0BnbWFpbC5jb20iLCJpYXQiOjE2MDkyMDk0MjUsImV4cCI6MTYxNjk4NTQyNSwiaXNzIjoiY2hhYmFjayIsInN1YiI6InJlZnJlc2hUb2tlbiJ9.Uyb9SVUUj1MumIwHFjc1PAhaREX_xx_c5uKBqRVBKl8`,
        detail : 'Wrong Token Subject',
        exp : 401
    },
    {
        token : '',
        detail : 'token is empty',
        exp : 401
    }

]

let invalidRefreshToken = [
    {
        userID : 'ok@gmail.com',
        token : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJva0BnbWFpbC5jb20iLCJpYXQiOjE2MDkyMDk0MjUsImV4cCI6MTYxNjk4NTQyNSwiaXNzIjoiY2hhYmFjayIsInN1YiI6InJlZnJlc2hUb2tlbiJ9.Uyb9SVUUj1MumIwHFjc1PAhaREX_xx_c5uKBqRVBKl8`,
        detail : 'user and token pair is not found',
        exp : 404
    },
    {
        userID : 'ok@gmail.com',
        token : '',
        detail : 'token is empty',
        exp : 401
    },
    {
        userID : 'dsadas',
        token : '',
        detail : 'userID does not exist',
        exp : 400
    },
]
let undefinedUser = [
    {
        userID : 'test@gmail.com',
        userPassword : '12345',
        detail : 'outDated',
        exp : 403
    },
    {
        userID : 'test1@gmail.com',
        userPassword : '12345',
        detail : 'not verified',
        exp : 403
    },
    {
        userPassword : '12345',
        detail : 'Invalid value',
        exp : 400
    },
    {
        userID : 'test1@gmailcom',
        userPassword : '12345',
        detail : 'userID should not be Empty and be email',
        exp : 400
    },
    {
        userID : 'test1@gmail.com',
        detail : 'userPassword should not be Empty',
        exp : 400
    },
]


module.exports = {
    sendEmailInvalidInput : sendEmailInvalidInput,
    invalidToken : invalidToken,
    invalidRefreshToken : invalidRefreshToken,
    undefinedUser : undefinedUser
}