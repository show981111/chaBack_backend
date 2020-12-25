let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { response } = require('express');
const { expect } = require('chai');

chai.should();

describe('Comment API', function(){
    var _id;
    describe('Post api/v1/comment', function(){
        it('it should create comment', (done)=>{
            const commentItem = {
                parentID : '5fe5ef811f23fe215c96238e',
                userID : 'test@gmail.com',
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment")
                .send(commentItem)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    _id = response.body._id;
                    console.log('------------')
                    console.log(_id)
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 400(does not have parent ID)', (done)=>{
            const commentItem = {
                userID : 'test@gmail.com',
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment")
                .send(commentItem)
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 404(invalid parentID)', (done)=>{
            const commentItem = {
                parentID : '5fe5ef811f23fe215c96238f',
                userID : 'test@gmail.com',
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment")
                .send(commentItem)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })
})