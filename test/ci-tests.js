'use strict';

const chai = require('chai');
const chatHttp = require('chai-http');
const mocha = require('mocha');
const should = chai.should();
const { app } = require('../server');

chai.use(chatHttp);

describe('Root URL', function() {
    
  it('should return static HTML', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        res.should.have.status(200);
      });

  });


});