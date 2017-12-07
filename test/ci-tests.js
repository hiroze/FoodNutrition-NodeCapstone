'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const should = chai.should();
const mongoose = require('mongoose');
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');
const  FoodNutrition  = require('../db/models');
const testData = require('../db/seed-data');
mongoose.Promise = global.Promise;


chai.use(chaiHttp);

const tearDownDb = () => {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
};

describe('Food Item API Resource', function() {
  
  before(function() {
    console.log('starting web server for tests...');
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    console.log('Seeding nutrition data for tests..');
    return FoodNutrition.insertMany(testData);
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });
  
  describe('GET root endpoint', function(){ 
    it('should exist', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          res.should.have.status(200);
          res.should.have.header('content-type', 'text/html; charset=UTF-8');
        });
    });
    it ('should return all items from the db', function() {
      let item;
      return chai.request(app)
        .get('/v1/items')
        .then(function(temp) {
          item = temp;
          item.should.have.status(200);
          item.body.should.have.lengthOf.at.least(1);
          return FoodNutrition.count();
        })
        .then(function(count) {
          item.body.should.have.lengthOf(count);
        });

    });

  });

});