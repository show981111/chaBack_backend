let request = require('supertest');
const chai = require('chai');
let app = require("../app.js");
const { expect } = require('chai');
const testData = require('./testData/place.data.js');
const { sendEmailInvalidInput, undefinedUser } = require('./testData/auth.data.js');
const { response } = require('express');

chai.should();

describe('PLACE API', function(){

    describe('GET PLACE /api/v1/place/:region/:category/:bathroom/:water/:price/:before', function() {
        var test = {
            'region' : 'a',
            'category' : 'a',
            'bathroom' : 0,
            'water' : 1,
            'price' : -1,
            'before' : '2019-05-01'
        };
        
        it('it should return place lists' , (done) => {
            request(app)
                .get(`/api/v1/place/${test['region']}/${test['category']}/${test['bathroom']}/${test['water']}/${test['price']}/${test['before']}`)
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
                    .get(`/api/v1/place/${invalidDataProvider['region']}/${invalidDataProvider['category']}/${invalidDataProvider['bathroom']}/${invalidDataProvider['water']}/${invalidDataProvider['price']}/${invalidDataProvider['before']}`)
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
})