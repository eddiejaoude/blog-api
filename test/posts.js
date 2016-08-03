var supertest = require('supertest');
var assert = require('chai').assert;
var should = require("should");
var models = require('../models');
var server = supertest.agent("http://localhost:3000");

describe('GET /posts', function () {
    it('lists Posts', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .get('/posts')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.length.should.be.above(0);
                    done();
                });
        });
    });
});

describe('GET /posts/{id}', function () {
    it('gets existing Post details', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .get('/posts/' + post.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.id.should.be.equal(post.id);
                    done();
                });
        });
    });
});

describe('GET /posts/{id}', function () {
    it('tries to get non existing Post', function (done) {
        server
            .get('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('POST /posts with no Tags', function () {
    it('creates Post', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.title.should.be.equal(postData.title);
                res.body.description.should.be.equal(postData.description);
                done();
            });
    });
});

describe('POST /posts with no Tags', function () {
    it('tries to create an invalid Post', function (done) {
        var postData = {
            title: 'T',
            description: 'Test Post description'
        };

        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('title');
                done();
            });
    });
});

describe('POST /posts with Tags', function () {
    it('creates a new Post', function (done) {
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

describe('POST /posts with Tags', function () {
    it('tries to create an invalid Post', function (done) {
        var postData = {
            title: 'T',
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
                .end(function (err, res) {
                    res.status.should.equal(400);
                    res.body.length.should.be.equal(1);
                    res.body[0].message.should.be.not.empty;
                    res.body[0].path.should.be.equal('title');
                    done();
                });
        });
    });
});

describe('DELETE /posts', function () {
    it('deletes existing Post', function (done) {
        var postData = {
            title: 'Test Post to Delete',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .delete('/posts/' + post.id)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    res.status.should.equal(204);
                    models.post.findById(post.id).then(function(post) {
                        assert.isNull(post);
                    });
                    done();
                });
        });
    });
});

describe('DELETE /posts', function () {
    it('tries to delete non existing Post', function (done) {
        server
            .delete('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('PUT /posts/{id}', function () {
    it('tries to update non existing Post', function (done) {
        server
            .put('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .end(function (err, res) {
                res.status.should.equal(404);
                done();
            });
    });
});

describe('PUT /posts/{id} with no Tags', function () {
    it('updates an existing Post with no Tags', function (done) {
        var postData = {
            title: 'Test Post to Update',
            description: 'Test Post description'
        };
        var postDataUpdate = {
            title: 'Test Post Updated',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .put('/posts/' + post.id)
                .send(postDataUpdate)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    res.status.should.equal(200);
                    res.body.title.should.equal(postDataUpdate.title);
                    done();
                });
        });
    });
});

describe('PUT /posts/{id} with no Tags', function () {
    it('tries to update an invalid Post', function (done) {
        var postData = {
            title: 'Test Post Update',
            description: 'Test Post description'
        };
        var postDataUpdate = {
            title: 'T',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            server
                .put('/posts/' + post.id)
                .send(postDataUpdate)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    res.status.should.equal(400);
                    res.body.length.should.be.equal(1);
                    res.body[0].message.should.be.not.empty;
                    res.body[0].path.should.be.equal('title');
                    done();
                });
        });
    });
});

describe('PUT /posts/{id} with Tags', function () {
    it('updates an existing Post with Tags', function (done) {
        var postData = {
            title: 'Test Post title to Update',
            description: 'Test Post description'
        };
        var postDataUpdate = {
            title: 'Test Post Updated',
            description: 'Test Post description'
        };
        var tagData = {
            name: 'Test Tag for Post'
        };

        models.post.create(postData).then(function (post) {
            models.tag.create(tagData).then(function (tag) {
                server
                    .put('/posts/' + post.id)
                    .send({title: postDataUpdate.title, description: postDataUpdate.description, tags: [{id: tag.id}]})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        res.status.should.equal(200);
                        res.body.id.should.be.equal(post.id);
                        res.body.title.should.be.equal(postDataUpdate.title);
                        res.body.tags.length.should.be.equal(1);
                        res.body.tags[0].id.should.be.equal(tag.id);
                        res.body.tags[0].name.should.be.equal(tagData.name);
                        done();
                    });
            });
        });
    });
});

describe('PUT /posts/{id} with Tags', function () {
    it('tries to update an invalid Post with Tags', function (done) {
        var postData = {
            title: 'Test Post title to Update',
            description: 'Test Post description'
        };
        var postDataUpdate = {
            title: 'T',
            description: 'Test Post description'
        };
        var tagData = {
            name: 'Test Tag for Post'
        };

        models.post.create(postData).then(function (post) {
            models.tag.create(tagData).then(function (tag) {
                server
                    .put('/posts/' + post.id)
                    .send({title: postDataUpdate.title, description: postDataUpdate.description, tags: [{id: tag.id}]})
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        res.status.should.equal(400);
                        res.body.length.should.be.equal(1);
                        res.body[0].message.should.be.not.empty;
                        res.body[0].path.should.be.equal('title');
                        done();
                    });
            });
        });
    });
});
