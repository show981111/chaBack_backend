let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/auth.data.js');
const { sendEmailInvalidInput } = require('./testData/auth.data.js');

chai.should();
var verificationToken ;
describe('Auth API', function(){
    
    describe('Send Verification Email To User /api/v1/auth/email/verify', function(){
        const user = {userID : 'show981111@gmail.com'};
        it('it should send Email to User', (done) => {
            request(app)
                .post('/api/v1/auth/email/verify')
                .send(user)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    verificationToken = response.body.token;
                    console.log(verificationToken);
                    response.body.should.be.a('object');
                done();
            })
        })

        let failSendEmail = function(invalidInputProvider, i ){
            it(`it should be ${invalidInputProvider.exp}: ${invalidInputProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .post('/api/v1/auth/email/verify')
                    .send(invalidInputProvider)
                    .expect(invalidInputProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        response.body.should.be.a('object');
                    done();
                })
            })
        }

        for(var i = 0; i < testData.sendEmailInvalidInput.length; i++){
            failSendEmail(testData.sendEmailInvalidInput[i], i);
        }
    })

    describe('Verify user /api/v1/auth/email/verify/:token', function(){
        it('it should verify user', (done) => {
            request(app)
                .post('/api/v1/auth/email/verify/'+verificationToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            })
        })

        it(`it should be 401 due to expired token`, (done) => {
            request(app)
                .post(`/api/v1/auth/email/verify/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJzaG93OTgxMTExQGdtYWlsLmNvbSIsImlhdCI6MTYwOTE2ODE1NywiZXhwIjoxNjA5MTY4MzM3LCJpc3MiOiJjaGFiYWNrIiwic3ViIjoiRW1haWwgdmVyaWZpY2F0aW9uIn0.0eT36jvEI_jIeTUPNSz0Cdut85HEMEjq6GLWzUN-n3U`)
                .expect(401)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    response.body.should.be.a('object');
                done();
            })
        })
    })

    describe('Verify user /api/v1/auth/login', function(){
        var accessToken;
        
        const loginUser = {
            userID : 'ok@gmail.com',
            userPassword : '1234'
        }
        it(`it should get user information`, (done) => {
            request(app)
                .post("/api/v1/user/login")
                .send(loginUser)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                    accessToken = response.body.accessToken;
                    request(app)
                        .get('/api/v1/auth/login')
                        .set('Authorization', 'Bearer ' + accessToken)
                        .expect(200)
                        .end((err, response) => {
                            if(err) throw err;
                            console.log(response.body);
                            response.body.should.be.a('object');
                            expect(response.body).to.have.property('userID');
                            expect(response.body).to.have.property('userNickName');
                            expect(response.body).to.have.property('userName');
                            expect(response.body).to.have.property('userPhone');
                        })
                        done();
            });
        })
        it(`it should be 401 due to wrong subject`, (done) =>{
            request(app)
                .get('/api/v1/auth/login')
                .set('Authorization', 'Bearer ' + verificationToken)
                .expect(401)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    response.body.should.be.a('object');
                })
                done();
        })

        let invalidTokenTest = function(invalidTokenProvider, i){
            it(`it should be ${invalidTokenProvider.exp} : ${invalidTokenProvider.detail} index : [${i}]`, (done) =>{
                request(app)
                    .get('/api/v1/auth/login')
                    .set('Authorization', 'Bearer ' + invalidTokenProvider.token)
                    .expect(invalidTokenProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        console.log(response.body);
                        response.body.should.be.a('object');
                    })
                    done();
            })
        }
        for(var i = 0; i < testData.invalidToken.length; i++){
            invalidTokenTest(testData.invalidToken[i], i);
        }

    })

})