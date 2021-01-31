let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');

chai.should();
var accessToken ;
describe('Comment API', function(){
    var _id;
    describe('Post api/v1/comment', function(){
        it('it should create comment', (done)=>{
            const commentItem = {
                parentID : '5fe5ef811f23fe215c96238e',
                userNickName : '안녕123',
                content : 'blablablablablabads',
            };
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
                        .post("/api/v1/comment")
                        .send(commentItem)
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
        })

        it('it should show 400(does not have parent ID)', (done)=>{
            const commentItem = {
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
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
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

    /* Get Test */

    describe('GET api/v1/comment/parent', function(){
        it('it should get comment by parent ID', (done)=>{
            request(app)
                .get("/api/v1/comment/parent/5fe5ef811f23fe215c96238e")
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('array');
                    for(var i = 0; i < response.body.length; i++){
                        expect(response.body[i].parentID).to.equal('5fe5ef811f23fe215c96238e');
                    }
                done();
            });
        })

        it('it should show 400(malformed parentID)', (done)=>{
            request(app)
                .get("/api/v1/comment/parent/fe5ef811f23f")
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

    describe('GET api/v1/comment/user', function(){
        it('it should get comment by user ID', (done)=>{
            request(app)
                .get("/api/v1/comment/user/test@gmail.com")
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('array');
                    for(var i = 0; i < response.body.length; i++){
                        expect(response.body[i].userID).to.equal('test@gmail.com');
                    }
                done();
            });
        })

        it('it should show 400(ID is not an email)', (done)=>{
            request(app)
                .get("/api/v1/comment/user/asdasdas")
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

    /* UPDATE TEST */
    describe('UPDATE api/v1/comment/', function(){
        const commentItem = {
            content : 'update Test',
        };
        it('it should update comment', (done)=>{
            request(app)
                .put("/api/v1/comment/" + _id)
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                    expect(response.body.content).to.equal('update Test');
                done();
            });
        })

        it('it should show 404(commentID does not exist)', (done)=>{
            request(app)
                .put("/api/v1/comment/5fe606056a7ffc310a22f59a")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

    /* DELETE TEST */

    describe('DELETE api/v1/comment/', function(){
        it('it should delete comment', (done)=>{
            request(app)
                .delete("/api/v1/comment/"+_id)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 404(commentID does not exist)', (done)=>{
            request(app)
                .delete("/api/v1/comment/5fe606056a7ffc310a22f59f")
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })

    describe('Post api/v1/comment/:replyParentID', function(){
        it('it should create comment and push reply into parent\'s replies', (done)=>{
            const commentItem = {
                parentID : '5fe5e6a789cccc1b4534038a',
                userNickName : 'testUser',
                content : 'reply to ObjectId("5fe6f0cff4ef276059634afa") hello~~',
            };
            request(app)
                .post("/api/v1/comment/5fe6f0cff4ef276059634afa")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) {console.log(err) ;throw err;}
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 400(does not have parent ID)', (done)=>{
            const commentItem = {
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment/5fe6f0c4f4ef276059634af9")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 404(invalid replyParentID)', (done)=>{
            const commentItem = {
                parentID : '5fe5e6a789cccc1b4534038a',
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment/5fe6f0c4f4ef276059634aff")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })

        it('it should show 404(invalid ParentID)', (done)=>{
            const commentItem = {
                parentID : '5fe5e6a789cccc1b45340388',
                userNickName : 'testUser',
                content : 'blablablablablabads',
            };
            request(app)
                .post("/api/v1/comment/5fe6f0c4f4ef276059634af9")
                .send(commentItem)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(404)
                .end((err, response) => {
                    if(err) throw err;
                    response.body.should.be.a('object');
                done();
            });
        })
    })
})