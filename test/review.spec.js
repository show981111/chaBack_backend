let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/review.data.js');

chai.should();
var accessToken;
var insertedReviewID;


describe('REVIEW API', function(){

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

    describe('POST REVIEW api/v1/review/', function(){
        const loginUser = {
            userID : 'ok@gmail.com',
            userPassword : '1234'
        }
        let testPost = function(postProvider, i){
            it(`it should be ${postProvider.exp} : ${postProvider.detail} index[${i}]`, (done) =>{
                request(app)
                    .post('/api/v1/review')
                    .set('Authorization', 'Bearer ' + accessToken)
                    .send(postProvider)
                    .expect(postProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postProvider.exp == 200){
                             expect(response.body).to.have.property('reviewID');
                             insertedReviewID = response.body.reviewID;
                             testData.reviewDeleteProvider[0].reviewID = insertedReviewID;
                        }
                        else {
                            response.body.error.should.equal(postProvider.detail);
                        }
                        done();
                    })
            })
        }
        for(var i = 0; i < testData.reviewPostProvider.length; i++){
            testPost(testData.reviewPostProvider[i], i);
        }
    })
    describe('PUT REVIEW api/v1/review/:reviewID/:placeID', function(){
    
        let testPut = function(putProvider, i){
            it(`it should be ${putProvider.exp} : ${putProvider.detail} index[${i}]`, (done) =>{
                request(app)
                    .put(`/api/v1/review/${putProvider.reviewID}/${putProvider.placeID}`)
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

        for(var i = 0; i < testData.reviewPutProvider.length; i++){
            console.log(insertedReviewID);
            testPut(testData.reviewPutProvider[i], i);
        }
    })

    describe('DELETE REVIEW api/v1/review/:reviewID/:placeID', function(){
    
        let testPut = function(deleteProvider, i){
            it(`it should be ${deleteProvider.exp} : ${deleteProvider.detail} index[${i}]`, (done) =>{
                request(app)
                    .delete(`/api/v1/review/${deleteProvider.reviewID}/${deleteProvider.placeID}`)
                    .send({imageKey : deleteProvider.imageKey})
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(deleteProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(deleteProvider.exp == 200) expect(response.text).to.equal('success');
                        else {
                            response.body.error.should.equal(deleteProvider.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i < testData.reviewDeleteProvider.length; i++){
            // console.log(insertedReviewID);
            testPut(testData.reviewDeleteProvider[i], i);
        }
    })

    //router.get('/user/:userID/:before', 
    //router.get('/:before', 
    //router.get('/place/:placeID/:before',

    describe('GET REVIEW API', function(){
        it('it get review list by userID', (done) => {
            request(app)
                .get('/api/v1/review/user/ok@gmail.com/10')
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++){
                        response.body[i].FK_REVIEW_userID.should.equal('ok@gmail.com');
                        response.body[i].should.have.property('userLiked');
                        response.body[i].reviewID.should.be.below(20);
                    }
                    done();
                })
        })

        it('it get review list by placeID', (done) => {
            request(app)
                .get('/api/v1/review/place/3/0')
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++){
                        response.body[i].FK_REVIEW_placeID.should.equal(3);
                        response.body[i].should.have.property('userLiked');
                        // response.body[i].reviewID.should.be.below(10);
                    }
                    done();
                })
        })

        it('it get all review list', (done) => {
            request(app)
                .get('/api/v1/review/0')
                //.set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    // for(var i = 0; i < response.body.length; i++){
                    //     // response.body[i].reviewID.should.be.below(10);
                    // }
                    done();
                })
        })
    })

})
