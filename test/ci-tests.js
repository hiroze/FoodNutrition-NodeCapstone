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
  
  describe('GET endpoint', function(){ 
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
    it('should return a single item by id', function() {
      let item;
      return FoodNutrition
        .findOne()
        .then(function(_item){
          item = _item;
          return chai.request(app).get(`/v1/items/${item.id}`);
        })
        .then(function(res) {
          // console.log(res);
          res.should.have.status(200);
          item.id.should.equal(res.body.id);
        });
    });
    describe('POST endpoint', function() {
      it('should create a new item', function() {
        const newItem = {
          name: 'foobarbizz',
          servingSize: 2,
          fat: 10,
          carbs: 50,
          protein: 11
        };
        const totalCals = newItem.fat*9+newItem.carbs*4+newItem.protein*4;
        return chai.request(app)
          .post('/v1/items/')
          .send(newItem)
          .then(function(res) {
            res.should.have.status(201);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.include.keys(
              'id', 'name', 'servingSize', 'fat', 'carbs', 'protein', 'totalCals'
            );
            res.body.id.should.not.be.null;
            res.body.name.should.equal(newItem.name);
            return FoodNutrition.findById(res.body.id);
          })
          .then(function(item) {
            //add property to db item for totalCals
            item.totalCals = item.fat*9+item.carbs*4+item.protein*4;
            item.name.should.equal(newItem.name);
            item.servingSize.should.equal(newItem.servingSize);
            item.protein.should.equal(newItem.protein);
            //check api representation
            item.totalCals.should.equal(totalCals);
          });
      });
      describe('PUT endpoint', function() {
        it('should update fields you send over', function() {
          const editData = {
            name: 'BizzBang',
            protein: 100
          };
          return FoodNutrition
            .findOne()
            .then(function(item) {
              editData.id = item.id;

              return chai.request(app)
                .put(`/v1/items/${editData.id}`)
                .send(editData);
            })
            .then(function(item) {
              item.body.name.should.equal(editData.name);
              item.body.protein.should.equal(editData.protein);
            });
        });
        describe('DELETE endpoint', function() {
          it('should delete an item by id', function() {
            let item;
            FoodNutrition
              .findOne()
              .then(function(_item) {
                item = _item;
                return chai.request(app).delete(`/v1/items/${item.id}`);
              })
              .then(function(res){
                res.should.have.status(204);
                return FoodNutrition.findById(item.id);
              })
              .then(function(_item) {
                should.not.exist(_item);
              });
          });
        });

      });


    });


  });

});