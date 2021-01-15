let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { response } = require('express');
const { expect } = require('chai');
const testData = require('./testData/user.data.js');

chai.should();
var accessToken;
describe('USER API', function(){
    const User = {
        userID : 'okk@gmail.com',
        userPassword : '1234',
        userNickName : 'okk6',
        userName : 'hehe',
        userPhone : '01011112222',
    }
    describe('REGISTER /api/v1/user/register', () => {
        it("It should create User", (done) => {
            request(app)
                .post("/api/v1/user/register")
                .send(User)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    // response.body.length.should.be.equ;
                done();
            });
        });

        function badRequestTest(provider, index){
            it("It should be badRequest" + index, (done) => {
                request(app)
                    .post("/api/v1/user/register")
                    .send(provider)
                    .expect(400)
                    .end((err, response) => {
                        if(err) throw err;
                        response.body.should.be.a('object')
                        console.log(response.body);
                    done();
                });
            });
        }
        function conflictTest(provider, index ){
            it("It should be dupliate" + index, (done) => {
                request(app)
                    .post("/api/v1/user/register")
                    .send(provider)
                    .expect(409)
                    .end((err, response) => {
                        if(err) throw err;
                        response.body.should.be.a('object');
                        console.log(response.body);
                    done();
                });
            });
        }

        for(var i = 0; i < testData.badRequestTestProvider.length; i++){
            badRequestTest(testData.badRequestTestProvider[i], i);
        }
        for(var i = 0; i < testData.conflictTestProvider.length; i++){
            conflictTest(testData.conflictTestProvider[i], i);
        }

    })

    describe('POST(login) /api/v1/user/login', () => {
        const loginUser = {
            userID : 'ok@gmail.com',
            userPassword : '1234'
        }
        it("it should get userInfo", (done) => {
            request(app)
                .post("/api/v1/user/login")
                .send(loginUser)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    response.body.should.be.a('object');
                    accessToken = response.body.accessToken;
                    expect(response.body).to.have.property('userID');
                    expect(response.body).to.have.property('userNickName');
                    expect(response.body).to.have.property('userName');
                    expect(response.body).to.have.property('userPhone');
                    expect(response.body).to.have.property('accessToken');
                    expect(response.body).to.have.property('refreshToken');
                done();
            });
        });

        let invalidInput = function(invalidLoginProvider, i){
            it(`It should be ${invalidLoginProvider.exp} ${invalidLoginProvider.detail} index:[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/user/login")
                    .send(invalidLoginProvider)
                    .expect(invalidLoginProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        console.log(response.body);
                        response.body.should.be.a('object');
                    done();
                });
            });
        }

        for(var i = 0; i < testData.invalidLoginProvider.length; i++){
            invalidInput(testData.invalidLoginProvider[i], i);
        }

    })

    describe('UPDATE /api/v1/user/', () => {
        it('it should update user information', (done) => {
            const User = {
                userNickName : 'updated NickName okk',
                userName : 'updated Name',
                userPhone : '01011112222'
            }
            request(app)
                .put('/api/v1/user')
                .send(User)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    response.body.should.be.a('object');
                done();
            })
        })
        let invalidInput = function(invalidUpdateProvider, i){
            it(`It should be ${invalidUpdateProvider.exp} detail : ${invalidUpdateProvider.detail} index:[${i}]`, (done) => {
                request(app)
                    .put("/api/v1/user/")
                    .send(invalidUpdateProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(invalidUpdateProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        console.log(response.body);
                        response.body.should.be.a('object');
                    done();
                });
            });
        }

        for(var i = 0 ; i < testData.updateUserFailProvider.length; i++){
            invalidInput(testData.updateUserFailProvider[i], i);
        }
    })

})