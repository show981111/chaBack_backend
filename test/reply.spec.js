let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
let testData = require('../test/testData/reply.data.js')
const { expect } = require('chai');

chai.should();

var accessToken;
var insertID;
describe('REPLY API', function(){
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

    describe('POST REPLY /api/v1/reply', function(){
        
        let postTest = function(postProvider, i){
            it(`it should be ${postProvider.exp} : ${postProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .post('/api/v1/reply')
                    .send(postProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(postProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postProvider.exp == 200){
                            expect(response.body).to.have.property('replyID');
                            insertID = response.body.replyID;
                            testData.deleteProvider[0].replyID = insertID;
                        }
                        else {
                            response.body.error.should.equal(postProvider.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.postProvider.length; i++){
            postTest(testData.postProvider[i], i);
        }

    })

    describe('PUT REPLY /api/v1/reply/:replyID', function(){
        
        let putTest = function(putProvider, i){
            it(`it should be ${putProvider.exp} : ${putProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .put(`/api/v1/reply/${putProvider.replyID}`)
                    .send(putProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(putProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(putProvider.exp == 200){
                            expect(response.text).to.equal('success');
                        }
                        else {
                            response.body.error.should.equal(putProvider.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.putProvider.length; i++){
            putTest(testData.putProvider[i], i);
        }

    })

    describe('DELETE REPLY /api/v1/reply/:replyID/:reviewID', function(){
        
        let deleteTest = function(deleteProvider, i){
            it(`it should be ${deleteProvider.exp} : ${deleteProvider.detail} ${deleteProvider.replyID} index[${i}]`, (done) => {
                request(app)
                    .delete(`/api/v1/reply/${deleteProvider.replyID}/${deleteProvider.reviewID}`)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(deleteProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(deleteProvider.exp == 200){
                            console.log('success to delete', deleteProvider.replyID)
                            expect(response.text).to.equal('success');
                        }
                        else {
                            response.body.error.should.equal(deleteProvider.detail);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.deleteProvider.length; i++){
            deleteTest(testData.deleteProvider[i], i);
        }

    })
    
    describe('GET REPLY by option', function(){
        it(`it should get reply by reviewID`, (done) => {
            request(app)
                .get(`/api/v1/reply/review/5`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++){
                        response.body[i].FK_REPLY_reviewID.should.be.equal(5);
                    }
                    done();
                })
        })
        it(`it should get reply by userID`, (done) => {
            request(app)
                .get(`/api/v1/reply/user/test@gmail.com`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++){
                        response.body[i].FK_REPLY_userID.should.be.equal('test@gmail.com');
                    }
                    done();
                })
        })
        it(`it should get reply by replyParentID`, (done) => {
            request(app)
                .get(`/api/v1/reply/rereply/6`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++){
                        response.body[i].replyParentID.should.be.equal(6);
                    }
                    done();
                })
        })
    })
})