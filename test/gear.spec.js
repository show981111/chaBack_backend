let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/gear.data.js');


chai.should();
var accessToken;


describe('GEAR API', function(){

    before('login user',function(done){  
        const loginUser = {
            userID : 'ok2@gmail.com',
            userPassword : '1234'
        }
        request(app)
            .post("/api/v1/user/admin/login")
            .send(loginUser)
            .expect(200)
            .end((err, response) => {
                if(err) throw err;
                accessToken = response.body.accessToken;
                console.log(accessToken);
                done();
            })
    })

    describe('GEAR POST API /api/v1/gear/', function(){
        let testPost = function(gearPostProvider, i){
            it(`It should be ${gearPostProvider.exp} : ${gearPostProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/gear")
                    .send(gearPostProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(gearPostProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(gearPostProvider.exp != 200){
                            response.body.error.should.equal(gearPostProvider.detail)
                        }else{
                            console.log(response.body)
                            expect(response.body).to.have.property('gearID');
                        }
                    })
                    done();
            })
        }

        for(var i = 0; i< testData.gearPostProvider.length; i++){
            testPost(testData.gearPostProvider[i], i);
        }

    })

    describe('GEAR UPDATE API /api/v1/gear', function(){
        let testPut = function(gearPutProvider, i){
            it(`It should be ${gearPutProvider.exp} : ${gearPutProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .put(`/api/v1/gear/${gearPutProvider.gearID}`)
                    .send(gearPutProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(gearPutProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        if(gearPutProvider.exp != 200){
                            response.body.error.should.equal(gearPutProvider.detail)
                        }else{
                            console.log(response.body)
                            response.text.should.equal('success');
                        }
                    })
                    done();
            })
        }

        for(var j = 0; j< testData.gearPutProvider.length; j++){
            console.log(j, testData.gearPutProvider[j].detail)
            testPut(testData.gearPutProvider[j], j);
        }
    })
})