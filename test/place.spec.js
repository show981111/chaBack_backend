let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/place.data.js');
const { sendEmailInvalidInput, undefinedUser } = require('./testData/auth.data.js');
const { response } = require('express');

chai.should();
var accessToken;
describe('PLACE API', function(){

    describe('GET PLACE /api/v1/place/:region/:category/:bathroom/:water/:price/:placeName/:before/:option', function() {
        var test = {
            'region' : 'a',
            'category' : 'a',
            'bathroom' : 0,
            'water' : 1,
            'price' : -1,
            'placeName' : '4C',
            'before' : '2019-05-01',
            'option' : 'date'
        };
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
                            expect(response.text).to.equal('success');
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
})