var supertest = require('supertest');
var should = require("should");
var server = supertest.agent("http://localhost:3000");

describe('GET /posts', function() {
  it('respond with json', function(done) {
    server
      .get('/posts')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.posts.length.should.equal(1);
      done();
    });
  });
});
