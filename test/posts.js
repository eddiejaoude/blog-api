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
        res.body.length.should.be.above(1);
      done();
    });
  });
});

describe('GET /posts/1', function() {
  it('respond with json', function(done) {
    server
      .get('/posts/1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err,res){
        res.status.should.equal(200);
        res.body.id.should.be.equal(1);
      done();
    });
  });
});

describe('POST /posts with no Tags', function() {
  it('respond with json', function(done) {
    var postTitle = "New post title";
    var postDescription = "New post description";
    server
      .post('/posts')
      .send({title: postTitle, description: postDescription})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err,res){
        res.status.should.equal(201);
        res.body.id.should.be.above(1);
        res.body.title.should.be.equal(postTitle);
        res.body.description.should.be.equal(postDescription);
      done();
    });
  });
});

describe('POST /posts with Tags', function() {
  it('respond with json', function(done) {
    var postTitle = "New post title with Tags";
    var postDescription = "New post description with Tags";
    var postTags = [{id: 1}, {id: 2}];
    server
      .post('/posts')
      .send({title: postTitle, description: postDescription, tags: postTags})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function(err,res){
        res.status.should.equal(201);
        res.body.id.should.be.above(1);
        res.body.title.should.be.equal(postTitle);
        res.body.description.should.be.equal(postDescription);
        res.body.tags.length.should.be.equal(2);
      done();
    });
  });
});
