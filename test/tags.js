var supertest = require('supertest');
var should = require("should");
var models = require('../models');
var server = supertest.agent("http://localhost:3000");

describe('GET /tags', function () {
    it('lists Tags', function (done) {
        server
            .get('/tags')
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

describe('GET /tags/{id}', function () {
    it('gets existing Tag details with Posts', function (done) {
        var tagData = {
            name: 'Tag name'
        };
        var postData = {
            title: 'Test Post title with Tag',
            description: 'Test Post description'
        };

        models.tag.create(tagData).then(function (tag) {
            models.post.create(postData).then(function (post) {
                post.setTags([tag]).then(function () {
                    server
                        .get('/tags/' + tag.id)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end(function (err, res) {
                            res.status.should.equal(200);
                            res.body.id.should.be.equal(tag.id);
                            res.body.name.should.be.equal(tagData.name);
                            res.body.posts.length.should.be.equal(1);
                            res.body.posts[0].id.should.be.equal(post.id);
                            res.body.posts[0].title.should.be.equal(postData.title);
                            res.body.posts[0].description.should.be.equal(postData.description);
                            done();
                        });
                });
            });
        });
    });
});

describe('GET /tags/{id}', function () {
    it('tries to get non existing Tag', function (done) {
        server
            .get('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('POST /tags', function () {
    it('creates a new Tag', function (done) {
        var tagData = {
            name: 'Test Tag'
        };

        server
            .post('/tags')
            .send(tagData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function (err, res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.name.should.be.equal(tagData.name);
                done();
            });
    });
});

describe('DELETE /tags/{id}', function () {
    it('deletes existing Tag', function (done) {
        var tagData = {
            name: 'Test Tag to Delete'
        };

        models.tag.create(tagData).then(function (tag) {
            server
                .delete('/tags/' + tag.id)
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

describe('DELETE /tags/{id}', function () {
    it('tries to delete non existing Tag', function (done) {
        server
            .delete('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('PUT /tags/{id}', function () {
    it('updates an existing Tag', function (done) {
        var tagData = {
            name: 'Test Tag to Update'
        };
        var tagDataUpdate = {
            name: 'Test Tag Updated'
        };

        models.tag.create(tagData).then(function (tag) {
            server
                .put('/tags/' + tag.id)
                .send(tagDataUpdate)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.name.should.equal(tagDataUpdate.name);
                    done();
                });
        });
    });
});

describe('PUT /tags/{id}', function () {
    it('tries to update non existing Tag', function (done) {
        server
            .put('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});
