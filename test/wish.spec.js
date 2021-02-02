let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/wish.data.js');

chai.should();
var accessToken;

describe('WISH API', function(){

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

    describe('POST WISH TO PLACE /api/v1/wish/', function(){

        let postWishTest = function(postWishData, i){
            it(`It should be ${postWishData.exp} : ${postWishData.detail} index[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/wish/"+postWishData.placeID)
                    .send(postWishData)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(postWishData.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postWishData.exp != 200 && postWishData.exp != 204){
                            response.body.error.should.equal(postWishData.detail);
                        }
                    })
                    done();
            })
        }

        for(var i = 0; i < testData.wishProvider.length; i++){
            postWishTest(testData.wishProvider[i], i);
        }
    })

    describe('DELETE WISH /api/v1/wish/', function(){

        let deleteWishTest = function(deleteTestData, i){
            it(`It should be ${deleteTestData.exp} : ${deleteTestData.detail} index[${i}]`, (done) => {
                request(app)
                    .delete("/api/v1/wish/" + deleteTestData.placeID)
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

        for(var j = 0; j < testData.wishProvider.length; j++){
            if(j == 1) continue; // skip 204 response
            deleteWishTest(testData.wishProvider[j], j);
        }
    })

    describe('GET WISH LIST /api/v1/wish/:userID', function(){

        it(`It should be get all the wishes`, (done) => {
            request(app)
                .get("/api/v1/wish/ok@gmail.com")
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++)
                    {
                        expect(response.body[i]).to.have.property('FK_WISH_placeID');
                    }
                    done();
                })
        })
       
    })
})