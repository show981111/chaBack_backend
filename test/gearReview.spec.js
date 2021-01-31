let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/gear-review.data.js');


chai.should();
var accessToken;
var insertId;

describe('GEAR API', function(){
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

    describe('GEAR REVIEW POST API /api/v1/gear-review/', function(){
        let testPost = function(postProvider, i){
            it(`It should be ${postProvider.exp} : ${postProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/gear-review")
                    .send(postProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(postProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(postProvider.exp != 200){
                            response.body.error.should.equal(postProvider.detail)
                        }else{
                            console.log(response.body)
                            expect(response.body).to.have.property('gearReviewID');
                            insertId = response.body.gearReviewID;
                            testData.deleteProvider[0].gearReviewID = insertId;
                            console.log('insert ID ',insertId);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.postProvider.length; i++){
            testPost(testData.postProvider[i], i);
        }

    })

    describe('GEAR REVIEW PUT API /api/v1/gear-review/:gearReviewID', function(){
        let testPut = function(putProvider, i){
            it(`It should be ${putProvider.exp} : ${putProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .put("/api/v1/gear-review/"+putProvider.gearReviewID)
                    .send(putProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(putProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(putProvider.exp != 200){
                            response.body.error.should.equal(putProvider.detail)
                        }else{
                            console.log(response.body)
                            insertId = response.body.gearReviewID;
                            //testData.gearDeleteProvider[0].gearReviewID = insertId;
                            console.log('insert ID ',insertId);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.putProvider.length; i++){
            testPut(testData.putProvider[i], i);
        }

    })

    describe('GEAR REVIEW DELETE API /api/v1/gear-review/:gearID/:gearReviewID/:point', function(){
        let testDelete = function(deleteProvider, i){
            it(`It should be ${deleteProvider.exp} : ${deleteProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .delete(`/api/v1/gear-review/${deleteProvider.gearID}/${deleteProvider.gearReviewID}/${deleteProvider.point}`)
                    .send(deleteProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(deleteProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(deleteProvider.exp != 200){
                            response.body.error.should.equal(deleteProvider.detail)
                        }else{
                            console.log(response.body)
                            insertId = response.body.gearReviewID;
                            //testData.gearDeleteProvider[0].gearReviewID = insertId;
                            console.log('insert ID ',insertId);
                        }
                        done();
                    })
            })
        }

        for(var i = 0; i< testData.deleteProvider.length; i++){
            testDelete(testData.deleteProvider[i], i);
        }

    })

    describe('GEAR REVIEW GET API /api/v1/gear-review/gear/:gearID', function(){
        
        it(`It should get gear review according to gearID`, (done) => {
            request(app)
                .get(`/api/v1/gear-review/gear/3`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    for(var j = 0; j < response.body.length; j++)
                    {
                        response.body[j].FK_GREVIEW_gearID.should.equal(3);
                    }
                    done();
                })
        })
        
        it(`It should get gear review according to userID`, (done) => {
            request(app)
                .get(`/api/v1/gear-review/user/ok@gmail.com`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    for(var j = 0; j < response.body.length; j++)
                    {
                        response.body[j].FK_GREVIEW_userID.should.equal('ok@gmail.com');
                    }
                    done();
                })
        })
        
       

    })
})
