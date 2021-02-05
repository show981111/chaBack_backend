let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/realTime.data.js');
const { response } = require('express');

chai.should();
var accessToken;
var insertedID;

describe('RealTime API', function(){

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

    describe('POST RealTime', function(){
        let postTest = function(data, i ){
            it(`it should be ${data.exp} : ${data.detail} : index[${i}]`, (done) =>{
                request(app)
                    .post("/api/v1/real-time")
                    .send(data)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(data.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        
                        if(data.exp == 200){
                            response.body.should.have.property('realTimeID');
                            testData.deleteProvider[0].realTimeID= response.body.realTimeID;
                            console.log(response.body.realTimeID, testData.deleteProvider[0].realTimeID);
                        }else{
                            expect(response.body.error).to.equal(data.detail);
                        }
                        done();
                    });
            })
        }
        for(var j = 0; j < testData.postProvier.length ; j++){
            postTest(testData.postProvier[j], j);
        }
    })

    describe('PUT RealTime /api/v1/real-time/:reaTimeID', function(){
        let putTest = function(data, i ){
            it(`it should be ${data.exp} : ${data.detail} index[${i}]`, (done) =>{
                request(app)
                    .put("/api/v1/real-time/"+ data.realTimeID)
                    .send(data)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(data.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        
                        if(data.exp == 200){
                            expect(response.text).to.equal(data.detail);
                        }else{
                            expect(response.body.error).to.equal(data.detail);
                        }
                        done();
                    });
            })
        }
        for(var j = 0; j < testData.putProvider.length ; j++){
            putTest(testData.putProvider[j], j);
        }
    })

    describe('DELETE RealTime /api/v1/real-time/:realTimeID', function(){
        let deleteTest = function(data, i ){
            it(`it should be ${data.exp} : ${data.detail}, ${data.realTimeID} index[${i}]`, (done) =>{
                request(app)
                    .delete("/api/v1/real-time/"+ data.realTimeID)
                    .send(data)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(data.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        
                        if(data.exp == 200){
                            expect(response.text).to.equal(data.detail);
                        }else{
                            expect(response.body.error).to.equal(data.detail);
                        }
                        done();
                    });
            })
        }
        for(var j = 0; j < testData.deleteProvider.length ; j++){
            deleteTest(testData.deleteProvider[j], j);
        }
    })

    describe('GET RealTime /api/v1/real-time/0/10', function(){
        it(`it should get realTime list regardless of placeID`, (done) =>{
            request(app)
                .get('/api/v1/real-time/0/10')
                .expect(200)
                .end((err, response) => {
                    if(err) { throw err;}
                    console.log(response.body);
                    expect(response.body).length(10);
                    for(var i = 0; i <  response.body.length ; i++){
                        response.body[i].should.have.property('placeName');
                        response.body[i].should.have.property('userNickName');
                        response.body[i].should.have.property('profileImg');
                    }
                    done();
                });
        })
    })

    describe('GET RealTime /api/v1/real-time/place/:placeID/:pageNumber/:parseNum', function(){
        it(`it should get realTime list regardless of placeID`, (done) =>{
            request(app)
                .get('/api/v1/real-time/place/3/0/10')
                .expect(200)
                .end((err, response) => {
                    if(err) { throw err;}
                    console.log(response.body);
                    expect(response.body).length(10);
                    for(var i = 0; i <  response.body.length ; i++){
                        response.body[i].should.have.property('userNickName');
                        response.body[i].should.have.property('profileImg');
                        response.body[i].FK_REALTIME_placeID.should.equal(3);
                    }
                    done();
                });
        })
    })
})