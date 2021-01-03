let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/place.data.js');
const { sendEmailInvalidInput, undefinedUser } = require('./testData/auth.data.js');
const { response } = require('express');

chai.should();
var accessToken;
var insertedPlaceID;
describe('PLACE API', function(){
    var test = {
        'region' : 'a',
        'category' : 'a',
        'bathroom' : 0,
        'water' : 1,
        'price' : -1,
        'placeName' : '4C',
        'before' : 5,
        'option' : 'id'
    };

    describe('GET PLACE /api/v1/place/:region/:category/:bathroom/:water/:price/:placeName/:before/:option', function() {

        console.log(test['placeName']);
        it('it should return place lists' , (done) => {
            request(app)
                .get(`/api/v1/place/${test['region']}/${test['category']}/${test['bathroom']}/${test['water']}/
                ${test['price']}/${test['placeName']}/${test['before']}/${test['option']}`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++)
                    {
                        response.body[i].region.should.be.equal(test['region']);
                        response.body[i].category.should.to.equal(test['category']);
                        if(test['bathroom'] != -1 ) response.body[i].bathroom.should.to.equal(test['bathroom']);
                        if(test['water'] != -1 ) response.body[i].water.should.to.equal(test['water']);
                        if(test['price'] != -1 ) response.body[i].price.should.to.equal(test['price']);
                        //response.body[i].updated.should.beforeOrEqualDate(test['before']);
                    }
                    done();
                })
        })

        let getInvalidTest = function(invalidDataProvider, i) {
            it(`it should be ${invalidDataProvider.exp} : ${invalidDataProvider.detail} index[${i}]`, (done)=>{
                request(app)
                    .get(`/api/v1/place/${invalidDataProvider['region']}/${invalidDataProvider['category']}/
                    ${invalidDataProvider['bathroom']}/${invalidDataProvider['water']}/${invalidDataProvider['price']}/
                    ${invalidDataProvider['placeName']}'/${invalidDataProvider['before']}/${invalidDataProvider['option']}`)
                    .expect(invalidDataProvider.exp)
                    .end((err, response) => {
                        if(err) throw err;
                        expect(response.body.error).to.equal(invalidDataProvider.detail);
                        done();
                    })
            })
        }

        for(var i = 0; i < testData.getPlaceInvalidProvider.length; i++){
            getInvalidTest(testData.getPlaceInvalidProvider[i], i);
        }
    })

    describe('GET PLACE according to current location api/v1/place/:region/:category/:bathroom/:water/:price/:placeName/:before/distance/:lat/:lng', function(){
        it('it should get places by distance', (done) => {
            request(app)
                .get(`/api/v1/place/${test['region']}/${test['category']}/${test['bathroom']}/0/
                ${test['price']}/-1/${3}/distance/28.0340000/120.6967000`)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    for(var i = 0; i < response.body.length; i++)
                    {
                        response.body[i].region.should.be.equal(test['region']);
                        response.body[i].category.should.to.equal(test['category']);
                        if(test['bathroom'] != -1 ) response.body[i].bathroom.should.to.equal(test['bathroom']);
                        if(test['water'] != -1 ) response.body[i].water.should.to.equal(0);
                        if(test['price'] != -1 ) response.body[i].price.should.to.equal(test['price']);
                        expect(response.body[i]).to.have.property('distance');
                        //response.body[i].updated.should.beforeOrEqualDate(test['before']);
                    }
                    done();
                })
        })

        it('it should be 400', (done) => {
            request(app)
                .get(`/api/v1/place/${test['region']}/${test['category']}/${test['bathroom']}/0/
                ${test['price']}/-1/${3}/distance/10/190`)
                .expect(400)
                .end((err, response) => {
                    if(err) throw err;
                    console.log(response.body);
                    response.body.error.should.equal('lng should be decimal');
                    done();
                })
        })
    })

    describe('POST PLACE /api/v1/place', function(params) {
        //placeName, userID, lat, lng, address, region, content, category, bathroom, water, price, totalPoint, imageKey
        const loginUser = {
            userID : 'ok@gmail.com',
            userPassword : '1234'
        }
        it('it should POST PLACE', (done) => {
            request(app)
                .post("/api/v1/user/login")
                .send(loginUser)
                .expect(200)
                .end((err, response) => {
                    if(err) throw err;
                    accessToken = response.body.accessToken;
                    request(app)
                        .post("/api/v1/place")
                        .send(testData.postProvier[0])
                        .set('Authorization', 'Bearer ' + accessToken)
                        .expect(200)
                        .end((err, response) => {
                            if(err) { throw err;}
                            expect(response.body).to.have.property('placeID');
                            insertedPlaceID = response.body.placeID;
                            console.log(insertedPlaceID);
                            done();
                        });
                    });
        })

        let invalidTest = function(invalidData, i) {
            it(`it should be ${invalidData.exp} : ${invalidData.detail} index[${i}]`, (done) => {
                request(app)
                    .post("/api/v1/place")
                    .send(invalidData)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(invalidData.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        expect(response.body.error).to.equal(invalidData.detail);
                        done();
                    });
            })
        }

        for(var i = 1; i < testData.postProvier.length; i++){
            invalidTest(testData.postProvier[i], i);
        }
    })

    describe('PUT PLACE api/v1/place/:placeID', function() {

        let updateTest = function (placeUpdateProvider, i) {
            it(`it should be ${placeUpdateProvider.exp} : ${placeUpdateProvider.detail} index[${i}]`, (done) => {
                request(app)
                    .put(`/api/v1/place/${placeUpdateProvider.placeID}`)
                    .send(placeUpdateProvider)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(placeUpdateProvider.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        if(placeUpdateProvider.exp == 200) response.text.should.equal('success');
                        else expect(response.body.error).to.equal(placeUpdateProvider.detail);
                        done();
                    });
            })
        }

        for(var i = 0; i < testData.placeUpdateProvider.length; i++){
            updateTest(testData.placeUpdateProvider[i],i);
        }
    })

    describe('DELETE PLACE api/v1/place/:placeID', function() {
        it(`it should be 200 : delete place `, (done) => {
            request(app)
                .delete(`/api/v1/place/${insertedPlaceID}`)
                .set('Authorization', 'Bearer ' + accessToken)
                .expect(200)
                .end((err, response) => {
                    if(err) { throw err;}
                    response.text.should.equal('success');
                    done();
                })
        })
        let deleteTest = function (input, i) {
            it(`it should be ${input.exp} : ${input.detail} index[${i}]`, (done) => {
                request(app)
                    .delete(`/api/v1/place/${input.placeID}`)
                    .set('Authorization', 'Bearer ' + accessToken)
                    .expect(input.exp)
                    .end((err, response) => {
                        if(err) { throw err;}
                        if(input.exp == 200) response.text.should.equal('success');
                        else expect(response.body.error).to.equal(input.detail);
                        done();
                    })
            })
        }
        for(var i = 0; i< testData.deleteProvider.length; i++){
            deleteTest(testData.deleteProvider[i], i);
        }
    })
})