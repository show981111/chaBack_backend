const badRequestTestProvider = [
    {
        userID : 'abcde@gmailcom',
        userPassword : '1234',
        userNickName : 'hihi123',
        userName : 'hehe',
        userPhone : '01011112222',
    },
    {
        userID : 'abcde@gmail.com',
        userNickName : 'hihi123',
        userName : 'hehe',
        userPhone : '01011112222',
    },
    {
        userID : 'abcde@gmail.com',
        userPassword : '1234',
        userNickName : 'hihi123',
        userName : 'hehe',
        userPhone : '01011112222123',
    },
    {
        userID : 'abcde@gmail.com',
        userPassword : '1234',
        userNickName : 'hihi123',
        userName : 'hehe',
        userPhone : '01011v12a22',
    },
    {
        userID : 'abcde@gmail.com',
        userPassword : '1234',
        userNickName : 'hihi123',
        userPhone : '01011v12a22',
    },
    {
        userID : 'abcde@gmail.com',
        userPassword : '1234',
        userPhone : '01011v12a22',
        userPhone : '01011112222123',
    },
]

const conflictTestProvider = [
    {
        userID : 'abc@gmail.com',
        userPassword : '1234',
        userNickName : 'unique1234',
        userName : 'hehe',
        userPhone : '01011112222',
    },
    {
        userID : 'unique@gmail.com',
        userPassword : '1234',
        userNickName : 'hi123',
        userName : 'hehe',
        userPhone : '01011112222',
    }
]

const invalidLoginProvider = [
    {
        userID : 'abc@gmailcom',
        userPassword : '1234',
        exp : 400,
        detail : 'ID is not Email'
    },
    {
        userPassword : '1234',
        exp : 400,
        detail : 'No ID'
    },
    {
        userID : 'unique@gmail.com',
        exp : 400,
        detail : 'No Password'
    },
    {
        userID : 'ok4124@gmail.com',
        userPassword : '1234',
        exp : 404,
        detail : 'ID does not exist'
    },
    {
        userID : 'ok@gmail.com',
        userPassword : '123',
        exp : 401,
        detail : 'incorrect password'
    }
]
module.exports = {
    badRequestTestProvider : badRequestTestProvider,
    conflictTestProvider : conflictTestProvider,
    invalidLoginProvider : invalidLoginProvider
}