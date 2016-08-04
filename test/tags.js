var supertest = require('supertest');
var assert = require('chai').assert;
var should = require("should");
var models = require('../models');
var server = supertest.agent("http://localhost:3000");

describe('Check that I can get a list of Tags with [GET] /tags', function () {
    var createdTag = null;

    it('should create a test Tag in the database', function (done) {
        var tagData = {
            name: 'Tag name for list'
        };

        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            done();
        });
    });

    it('should see the Tag ID in the list', function (done) {
        server
            .get('/tags')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.length.should.be.above(1);
                assert.equal(createdTag.id, res.body.find(function (tag) {
                    return tag.id === createdTag.id;
                }).id);
            })
            .end(done);
    });
});

describe('Check I get a Tag & related Posts with [GET] /tags/{id}', function () {
    var createdTag = null;
    var createdPost = null;
    var tagData = {
        name: 'Tag name for Post'
    };
    var postData = {
        title: 'Test Post title with Tag',
        description: 'Test Post description'
    };

    it('should create a test Tag in the database', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            done();
        });
    });

    it('should create a test Post in the database and assign the Tag', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            post.setTags([createdTag]).then(function () {
                done();
            });
        });
    });

    it('should get Tag & Post', function (done) {
        server
            .get('/tags/' + createdTag.id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.id.should.be.equal(createdTag.id);
                res.body.name.should.be.equal(tagData.name);
                res.body.posts.length.should.be.equal(1);
                res.body.posts[0].id.should.be.equal(createdPost.id);
                res.body.posts[0].title.should.be.equal(postData.title);
                res.body.posts[0].description.should.be.equal(postData.description);
            })
            .end(done);
    });
});

describe('Check I get an error when invalid Tag ID with [GET] /tags/{id}', function () {
    it('should get an error when using a non existing Tag ID', function (done) {
        server
            .get('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I can create a new Tag with [POST] /tags', function () {
    var createdTag = null;

    it('should create a new Tag', function (done) {
        var tagData = {
            name: 'Test Tag'
        };

        server
            .post('/tags')
            .send(tagData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.name.should.be.equal(tagData.name);
                createdTag = {id: res.body.id};
            })
            .end(done);
    });

    it('should exist in the database', function (done) {
        models.tag.findById(createdTag.id).then(function (tag) {
            assert.equal(createdTag.id, tag.id);
            done();
        });
    });
});

describe('Check I can not create an invalid Tag with [POST] /tags', function () {
    it('should respond with an error', function (done) {
        var tagData = {
            name: 'T'
        };

        server
            .post('/tags')
            .send(tagData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('name');
            })
            .end(done);
    });
});

describe('Check I can delete a Tag with [DELETE] /tags/{id}', function () {
    var createdTag = null;
    var tagData = {
        name: 'Test Tag to Delete'
    };

    it('should create a test Tag in the database', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            done();
        });
    });

    it('should delete an existing Tag', function (done) {
        server
            .delete('/tags/' + createdTag.id)
            .set('Accept', 'application/json')
            .expect(function (res) {
                res.status.should.equal(204);
            })
            .end(done);
    });

    it('should not find the Tag in the database', function (done) {
        models.tag.findById(createdTag.id).then(function (tag) {
            assert.isNull(tag);
            done();
        });
    });
});

describe('Check I get an error when trying to delete a non existing Tag with DELETE /tags/{id}', function () {
    it('should get an error when using a non existing Tag id', function (done) {
        server
            .delete('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I update an existing Tag with PUT /tags/{id}', function () {
    var createdTag = {
        name: 'Test Tag to Update'
    };
    var updatedTag = {
        name: 'Test Tag Updated'
    };

    it('should create a Tag in the database', function (done) {
        models.tag.create(createdTag).then(function (tag) {
            createdTag = tag;
            done();
        });
    });

    it('should update an existing Tag', function (done) {
        server
            .put('/tags/' + createdTag.id)
            .send(updatedTag)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.name.should.equal(updatedTag.name);
            })
            .end(done);
    });

    it('should check the Tag against the one in the database', function (done) {
        models.tag.findById(createdTag.id).then(function (tag) {
            assert.equal(updatedTag.name, tag.name);
            done();
        });
    });
});

describe('Check I can not update an non existing Tag with PUT /tags/{id}', function () {
    it('should respond with an error when trying to update non existing Tag', function (done) {
        server
            .put('/tags/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I can not update with an invalid Tag with PUT /tags/{id}', function () {
    var createdTag = {
        name: 'Test Tag to Update'
    };
    var updatedTag = {
        name: 'T'
    };

    it('should not update with an invalid Tag', function (done) {
        models.tag.create(createdTag).then(function (tag) {
            createdTag = tag;
            done();
        });
    });

    it('should not update with an invalid Tag', function (done) {
        server
            .put('/tags/' + createdTag.id)
            .send(updatedTag)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('name');
            })
            .end(done);
    });

    it('should not have been updated', function (done) {
        models.tag.findById(createdTag.id).then(function (tag) {
            assert.equal(createdTag.name, tag.name);
            done();
        });
    });
});
