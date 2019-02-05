'use strict';

const url = 'https://ENDPOINT' // update to the testing endpoint
const chai = require('chai');
const expect = require('chai').expect
const user = { username: 'cbschuld', password: 'password' }
const uuid = require('uuid')
chai.use(require('chai-http'))

describe('API endpoint /auth', function() {
  this.timeout(2000);

  // POST - test authentication
  it('should authenticate', function() {
    return chai.request(url)
      .post('/auth')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':'+user.password).toString('base64')))
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
      });
  });

  // POST - test authentication
  it('should NOT authenticate', function() {
    return chai.request(url)
      .post('/auth')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':badpassword').toString('base64')))
      .then(function(res) {
        expect(res).to.have.status(403)
      });
  });
});

describe('API endpoint /get', function() {
  this.timeout(2000);

  // GET - test get
  it('should get a value from key "testkey"', function() {
    return chai.request(url)
      .get('/get/testkey')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':'+user.password).toString('base64')))
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.value).to.be.an('string')
      });
  });
});


describe('API endpoint /set', function() {
  this.timeout(2000);

  // POST - test set
  it('should set a value to key "testkey"', function() {
    return chai.request(url)
      .post('/set/testkey')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':'+user.password).toString('base64')))
      .send({value: 'testValue'})
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.value).to.be.an('string')
        expect(res.body.value).equal('testValue')
      });
  });

  let u = uuid.v4()

  // POST - test set
  it('should set a random value to key "testkey2"', function() {
    return chai.request(url)
      .post('/set/testkey2')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':'+user.password).toString('base64')))
      .send({value:u})
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.value).to.be.a('string')
        expect(res.body.value).equal(u)
      });
  });

  // GET - test get
  it('should get a random value from key "testkey2"', function() {
    return chai.request(url)
      .get('/get/testkey2')
      .set('Authorization', 'Basic '+(Buffer.from(user.username+':'+user.password).toString('base64')))
      .then(function(res) {
        expect(res).to.have.status(200)
        expect(res).to.be.json
        expect(res.body).to.be.an('object')
        expect(res.body.value).to.be.an('string')
        expect(res.body.value).equal(u)
      });
  });

});