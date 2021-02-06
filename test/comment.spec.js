let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/comment.data.js');

chai.should();
var accessToken;
var insertedID;


describe('Comment API', function(){

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

    describe('POST Comment api/v1/comment/', function(){
        let testPost = function(postProvider, i){
            it(`it should be ${postProvider.exp} : ${postProvider.detail} index[${i}]`, (done) =>{
                request(app)
                    .post('/api/v1/comment/')
                    .set('Authorization', 'Bearer ' + accessToken)
                    .send(postProvider)
                    .expect(postProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postProvider.exp == 200){
                             expect(response.body).to.have.property('commentID');
                             insertedID = response.body.communityID;
                            //  testData.deleteProvider[0].communityID = insertedID;
                        }
                        else {
                            response.body.error.should.equal(postProvider.detail);
                        }
                        done();
                    })
            })
        }
        for(var i = 0; i < testData.postProvider.length; i++){
            testPost(testData.postProvider[i], i);
        }
    })
    describe('PUT COMMUNITY api/v1/community/:communityID', function(){
    
        let testPut = function(putProvider, i){
            it(`it should be ${putProvider.exp} : ${putProvider.detail} index[${i}]`, (done) =>{
                request(app)
                    .put(`/api/v1/community/${putProvider.communityID}`)
                    .send(putProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(putProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(putProvider.exp == 200) expect(response.text).to.equal('success');
                        else {
                            response.body.error.should.equal(putProvider.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i < testData.putProvider.length; i++){
            testPut(testData.putProvider[i], i);
        }
    })

    // describe('DELETE REVIEW api/v1/review/:reviewID/:placeID', function(){
    
    //     let testDelete = function(deleteProvider, i){
    //         it(`it should be ${deleteProvider.exp} : ${deleteProvider.detail} index[${i}]`, (done) =>{
    //             request(app)
    //                 .delete(`/api/v1/community/${deleteProvider.communityID}`)
    //                 .send({imageKey : deleteProvider.imageKey})
    //                 .set('Authorization', 'Bearer ' + accessToken)
    //                 .expect(deleteProvider.exp)
    //                 .end((err, response) => {
    //                     if(err) throw err;
    //                     if(deleteProvider.exp == 200) expect(response.text).to.equal('success');
    //                     else {
    //                         response.body.error.should.equal(deleteProvider.detail);
    //                     }
    //                     done();
    //                 })
    //         })
    //     }

    //     for(var i = 0; i < testData.deleteProvider.length; i++){
    //         // console.log(insertedReviewID);
    //         testDelete(testData.deleteProvider[i], i);
    //     }
    // })

    // describe('GET COMMUNITY API', function(){
    //     it('it get community list by userID', (done) => {
    //         request(app)
    //             .get('/api/v1/community/user/ok@gmail.com/0')
    //             .expect(200)
    //             .end((err, response) => {
    //                 if(err) throw err;
    //                 console.log(response.body);
    //                 for(var i = 0; i < response.body.length; i++){
    //                     response.body[i].FK_COMMUNITY_userID.should.equal('ok@gmail.com');
    //                 }
    //                 done();
    //             })
    //     })

    //     it('it get community list by category', (done) => {
    //         request(app)
    //             .get('/api/v1/community/1/0')
    //             .expect(200)
    //             .end((err, response) => {
    //                 if(err) throw err;
    //                 console.log(response.body);
    //                 for(var i = 0; i < response.body.length; i++){
    //                     response.body[i].category.should.equal(1);
    //                     // response.body[i].reviewID.should.be.below(10);
    //                 }
    //                 done();
    //             })
    //     })
    // })

})
