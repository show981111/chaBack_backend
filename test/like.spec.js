let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/like.data.js');

chai.should();
var accessToken;

describe('LIKE API', function(){

    before('login user',function(done){  
        const loginUser = {
            userID : 'ok@gmail.com',
            userPassword : '1234'
        }
        request(app)
            .post("/api/v1/user/login")
            .send(loginUser)
            .expect(200)
            .end((err, response) => {
                if(err) throw err;
                accessToken = response.body.accessToken;
                console.log(accessToken);
                done();
            })
    })

    describe('POST LIKE TO REVIEW /api/v1/like/review', function(){

        let postLikeTest = function(postTestData, i){
            it(`It should be ${postTestData.exp} : ${postTestData.detail} index[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/like/review")
                    .send(postTestData)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(postTestData.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postTestData.exp != 200){
                            response.body.error.should.equal(postTestData.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i < testData.LikeProvider.length; i++){
            postLikeTest(testData.LikeProvider[i], i);
        }
    })

    describe('DELETE LIKE ON REVIEW /api/v1/like/review', function(){

        let deleteLikeTest = function(deleteTestData, i){
            it(`It should be ${deleteTestData.exp} : ${deleteTestData.detail} index[${i}]`, (done) => {
                request(app)
                    .delete("/api/v1/like/review")
                    .send(deleteTestData)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(deleteTestData.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(deleteTestData.exp != 200){
                            response.body.error.should.equal(deleteTestData.detail);
                        }
                        done();
                    })
            })
        }

        for(var j = 0; j < testData.LikeProvider.length; j++){
            deleteLikeTest(testData.LikeProvider[j], j);
        }
    })

    describe('GET LIKE OF REVIEW /api/v1/like/review/:userID', function(){

        it(`It should be get all the reviews user liked `, (done) => {
            request(app)
                .get("/api/v1/like/review/ok@gmail.com")
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++)
                    {
                        expect(response.body[i]).to.have.property('FK_RLIKE_reviewID');
                    }
                    done();
                })
        })
       
    })
})