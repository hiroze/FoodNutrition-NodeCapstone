'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mocha = require('mocha');
const should = chai.should();
// const chaiFiles = require('chai-files');
// const expect = chai.expect;
// const file = chaiFiles.file;
// const dir = chaiFiles.dir;
const { app, runServer, closeServer } = require('../server');
const { TEST_DATABASE_URL } = require('../config');

//chai.use(chaiFiles);
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
    it('should serve a static HTML file', function() {
      return chai.request(app)
        .get('/')
        .then(function(res) {
          console.log(res.headers);
          res.should.have.status(200);
          res.should.have.header('content-type', 'text/html; charset=UTF-8');
        });

    });

  });


});