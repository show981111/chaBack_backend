let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { response } = require('express');
const { expect } = require('chai');
var util = require('util');

chai.should();

var accessToken;
describe('community api', function(){
    var _id; 
    //get all community posts
    describe("GET /api/v1/community", () => {
        it("It should GET all community posts", (done) => {
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
                    request(app)
                        .get("/api/v1/community")
                        .expect(200)
                        .end((err, response) => {
                            if(err) throw err;
                            response.body.should.be.a('array');
                            console.log(response.body);
                            //response.body.length.should.be.eq(3);
                    });
                done();
            });
        });

        it("It should NOT GET all the tasks", (done) => {
            request(app)
                .get("/api/community")
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                done();
            });
        });

        afterEach(function(){
            if (this.currentTest.state == 'failed') { 
                console.log("    Response body: " + util.inspect(response.body,{depth: null, colors: true}) + "\n");
            }
        }) 
    });

    describe("GET /api/v1/community/:userID", () => {
        it("It should GET user's posts ", (done) => {
            request(app)
                .get("/api/v1/community/testUser@gmal.com")
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('array');
                    //response.body.length.should.be.eq(3);
                done();
            });
        });

        it("It should show error due to validator", (done) => {
            request(app)
                .get("/api/v1/community/testuser@gmalom")
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                done();
            });
        });

    });

    describe("POST /api/v1/community/", () => {
        it("It should create post", (done) => {
            const postItem = {
                userID : 'test@gmail.com',
                userNickName : 'testUser',
                category : '실시간 현황',
                content : 'blablablablablabads',
                imageKey : ['first', 'sec', 'third']
            };
            request(app)
                .post("/api/v1/community")
                .send(postItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    _id = response.body._id;
                    console.log('------------')
                    console.log(_id)
                    response.body.should.be.a('object');
                done();
            });
        });

        it("It should show error because it has no userID", (done) => {
            const postItemWithoutUserID = {
                userNickName : 'testUser',
                category : '실시간 현황',
                content : 'blablablablablabads',
                imageKey : ['first', 'sec', 'third']
            };
            request(app)
                .post("/api/v1/community/")
                .send(postItemWithoutUserID)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                done();
            });
        });

    });

    describe("PUT /api/v1/community/:postID", () => {
        it("It should update post", (done) => {
            const postItem = {
                content : 'blablablablablabads',
                imageKey : ['first', 'sec', 'third', 'firth', 'fifth']
            };
            request(app)
                .put("/api/v1/community/"+_id)
                .send(postItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        });

        it("It should show error with 404", (done) => {
            const postItem = {
                content : 'blablablablablabads',
                imageKey : ['first', 'sec', 'third', 'firth', 'fifth']
            };
            request(app)
                .post("/api/v1/community/5fe5e8219f70441cac72a8ba")
                .send(postItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                done();
            });
        });

        it("It should be a bad request because it contains userID", (done) => {
            const postItem = {
                userID : 'dsadsa@asdas.com',
                content : 'blablablablablabads',
                imageKey : ['first', 'sec', 'third', 'firth', 'fifth']
            };
            request(app)
                .post("/api/v1/community/5fe5e8219f70441cac72a8ba")
                .send(postItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                done();
            });
        });

    });

    describe("DELETE /api/v1/community/:postID", function(){
        it("It should delete post item", (done) => {
            request(app)
                .delete("/api/v1/community/"+_id)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
        it("It should be 404", (done) => {
            request(app)
                .delete("/api/v1/community/5fe5e8219f70441cac72a8ba")
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
        it("It should be bad request(malformed post ID)", (done) => {
            request(app)
                .delete("/api/v1/community/5fe5e8219f70441cac7a")
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

})