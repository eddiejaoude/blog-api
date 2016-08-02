var supertest = require('supertest');
var should = require("should");
var models = require('../models');
var server = supertest.agent("http://localhost:3000");

describe('GET /posts', function () {
    it('respond with json', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .get('/posts')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.length.should.be.above(1);
                    done();
                });
        });
    });
});

describe('GET /posts/{id}', function () {
    it('respond with json', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .get('/posts/' + post.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.id.should.be.equal(post.id);
                    done();
                });
        });
    });
});

describe('POST /posts with no Tags', function () {
    it('respond with json', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.title.should.be.equal(postData.title);
                res.body.description.should.be.equal(postData.description);
                done();
            });
    });
});

describe('POST /posts with Tags', function () {
    it('respond with json', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };
        var tagData = {
            name: 'Test Tag for Post'
        };

        models.tag.create(tagData).then(function (tag) {
            server
                .post('/posts')
                .send({title: postData.title, description: postData.description, tags: [{id: tag.id}]})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end(function (err, res) {
                    res.status.should.equal(201);
                    res.body.id.should.be.above(1);
                    res.body.title.should.be.equal(postData.title);
                    res.body.description.should.be.equal(postData.description);
                    res.body.tags.length.should.be.equal(1);
                    res.body.tags[0].name.should.be.equal(tagData.name);
                    done();
                });
        });
    });
});

describe('DELETE /posts', function () {
    // delete tag
    it('deletes Post', function (done) {
        var postData = {
            name: 'Test Post to Delete'
        };

        models.post.create(postData).then(function (post) {
            server
                .delete('/posts/' + post.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(204)
                .end(function (err, res) {
                    res.status.should.equal(204);
                    done();
                });
        });
    });
});
