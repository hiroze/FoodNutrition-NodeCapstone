'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const should = chai.should();
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

chai.use(chaiHttp);

// const tearDownDb = () => {
//   console.warn('Deleting database');
//   return mongoose.connection.dropDatabase();
// };


describe('Food Item API Resource', function() {
  
  before(function() {
    console.log('starting web server for tests...');
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });
  
  describe('GET root endpoint', function() {
    it('should return static HTML', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          res.should.have.status(200);
        });
  

    });

  });


});