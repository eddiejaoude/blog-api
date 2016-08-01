var supertest = require('supertest');
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe('GET /tags', function() {
  it('respond with json', function(done) {
    server
      .get('/tags')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.length.should.be.above(1);
      done();
    });
  });
});

describe('POST /tags', function() {
  it('respond with json', function(done) {
    var tagName = "Test tag";
    server
      .post('/tags')
      .send({name: tagName})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err,res){
        res.status.should.equal(201);
        res.body.id.should.be.above(1);
        res.body.name.should.be.equal(tagName);
      done();
    });
  });
});
