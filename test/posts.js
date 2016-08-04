var app    = require('../app.js');
var server = require('supertest')(app);
var assert = require('chai').assert;
var should = require("should");
var models = require('../models');

describe('Check that I can get a list of Posts with [GET] /posts', function () {
    var createdPost = null;

    it('should create a test Post in the database', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should see the Post ID in the list', function (done) {
        server
            .get('/posts')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.length.should.be.above(0);
                assert.equal(createdPost.id, res.body.find(function (post) {
                    return post.id === createdPost.id;
                }).id);
            })
            .end(done);
    });
});

describe('Check that I can get Posts details by ID with [GET] /posts/{id}', function () {
    var createdPost = null;

    it('should create a test Post in the database', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should get existing Post details', function (done) {
        server
            .get('/posts/' + createdPost.id)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.id.should.be.equal(createdPost.id);
                res.body.title.should.be.equal(createdPost.title);
                res.body.description.should.be.equal(createdPost.description);
            })
            .end(done);
    });
});

describe('Check that I get an error when using an invalid Post ID with [GET] /posts/{id}', function () {
    it('should get an error for using non existing ID', function (done) {
        server
            .get('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I can create a new Post and no Tags with [POST] /posts', function () {
    var createdPost = null;

    it('should create a Post', function (done) {
        var postData = {
            title: 'Test Post title',
            description: 'Test Post description'
        };

        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.title.should.be.equal(postData.title);
                res.body.description.should.be.equal(postData.description);
                createdPost = res.body;
            })
            .end(done);
    });

    it('should exist in the database', function (done) {
        models.post.findById(createdPost.id).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(createdPost.name, post.name);
            assert.equal(createdPost.description, post.description);
            done();
        });
    });
});

describe('Check I can not create an invalid Post with [POST] /posts', function () {
    it('should get an error when trying to create an invalid Post', function (done) {
        var postData = {
            title: 'T',
            description: 'Test Post description'
        };

        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('title');
            })
            .end(done);
    });
});

describe('Check I can create a Post with Tags [POST] /posts', function () {
    var createdTag = null;
    var createdPost = null;
    var postData = {
        title: 'Test Post title',
        description: 'Test Post description'
    };
    var tagData = {
        name: 'Test Tag for Post'
    };

    it('should create a Tag', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            postData.tags = [tag];
            done();
        });
    });

    it('should create a new Post with a Tag', function (done) {
        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(201);
                res.body.id.should.be.above(1);
                res.body.title.should.be.equal(postData.title);
                res.body.description.should.be.equal(postData.description);
                res.body.tags.length.should.be.equal(1);
                res.body.tags[0].name.should.be.equal(tagData.name);
                createdPost = res.body;
            })
            .end(done);
    });

    it('should now exist in the database', function (done) {
        models.post.findOne({
            where: {
                id: createdPost.id
            },
            include: [{
                model: models.tag,
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }]
        }).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(createdPost.title, post.title);
            assert.equal(createdPost.description, post.description);
            assert.equal(createdPost.tags[0].id, post.tags[0].id);
            assert.equal(createdPost.tags[0].name, post.tags[0].name);
            done();
        });
    });
});

describe('Check I can not create an invalid Post with Tags [POST] /posts', function () {
    var createdTag = null;
    var tagData = {
        name: 'Test Tag for Post'
    };
    var postData = {
        title: 'T',
        description: 'Test Post description'
    };

    it('should create a Tag', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            postData.tags = [tag];
            done();
        });
    });

    it('should not create an invalid Post', function (done) {
        server
            .post('/posts')
            .send(postData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('title');
            })
            .end(done);
    });
});

describe('Check I can delete a Post [DELETE] /posts', function () {
    var createdPost = null;
    var postData = {
        title: 'Test Post to Delete',
        description: 'Test Post description'
    };

    it('should create a Post', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should delete an existing Post', function (done) {
        server
            .delete('/posts/' + createdPost.id)
            .set('Accept', 'application/json')
            .expect(function (res) {
                res.status.should.equal(204);
            })
            .end(done);
    });

    it('should not exist', function (done) {
        models.post.findById(createdPost.id).then(function (post) {
            assert.isNull(post);
            done();
        });
    });
});

describe('Check I can not delete a non existing Post [DELETE] /posts', function () {
    it('should get an error when trying to delete non existing Post', function (done) {
        server
            .delete('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I can not update a non existing Post [PUT] /posts/{id}', function () {
    it('should get an error when trying to update non existing Post', function (done) {
        server
            .put('/posts/' + Number.MAX_VALUE)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(404);
            })
            .end(done);
    });
});

describe('Check I can update a Post with no Tags with [PUT] /posts/{id}', function () {
    var createdPost = null;
    var postData = {
        title: 'Test Post to Update',
        description: 'Test Post description'
    };
    var postDataUpdate = {
        title: 'Test Post Updated',
        description: 'Test Post description Updated'
    };

    it('should create a Post', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should update an existing Post with no Tags', function (done) {
        server
            .put('/posts/' + createdPost.id)
            .send(postDataUpdate)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.title.should.equal(postDataUpdate.title);
            })
            .end(done);
    });

    it('should be updated in the database', function (done) {
        models.post.findById(createdPost.id).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(postDataUpdate.title, post.title);
            assert.equal(postDataUpdate.description, post.description);
            done();
        });
    });
});

describe('Check I can not update an invalid Post with [PUT] /posts/{id}', function () {
    var createdPost = null;
    var postData = {
        title: 'Test Post to not Update',
        description: 'Test Post description'
    };
    var postDataUpdate = {
        title: 'T',
        description: 'Test Post description Updated'
    };

    it('should create a Post', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should not update an existing Post with no Tags', function (done) {
        server
            .put('/posts/' + createdPost.id)
            .send(postDataUpdate)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('title');
            })
            .end(done);
    });

    it('should not be updated in the database', function (done) {
        models.post.findById(createdPost.id).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(postData.title, post.title);
            assert.equal(postData.description, post.description);
            done();
        });
    });
});

describe('Check I can update a Post containing Tags with [PUT] /posts/{id}', function () {
    var createdPost = null;
    var createdTag = null;
    var postData = {
        title: 'Test Post to Update',
        description: 'Test Post description'
    };
    var tagData = {
        name: 'Test Tag for Post Update'
    };
    var postDataUpdate = {
        title: 'Test Post Updated',
        description: 'Test Post description Updated'
    };

    it('should create a Post', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should create a Tag', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            postDataUpdate.tags = [tag];
            done();
        });
    });

    it('should update an existing Post with a Tag', function (done) {
        server
            .put('/posts/' + createdPost.id)
            .send(postDataUpdate)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(200);
                res.body.title.should.equal(postDataUpdate.title);
                res.body.description.should.equal(postDataUpdate.description);
                res.body.tags.length.should.equal(1);
                res.body.tags[0].name.should.equal(postDataUpdate.tags[0].name);
            })
            .end(done);
    });

    it('should be updated in the database', function (done) {
        models.post.findOne({
            where: {
                id: createdPost.id
            },
            include: [{
                model: models.tag,
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }]
        }).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(postDataUpdate.title, post.title);
            assert.equal(postDataUpdate.description, post.description);
            assert.equal(postDataUpdate.tags[0].name, post.tags[0].name);
            assert.equal(1, post.tags.length);
            done();
        });
    });
});

describe('Check I can not update an invalid Post containing Tags with [PUT] /posts/{id}', function () {
    var createdPost = null;
    var createdTag = null;
    var postData = {
        title: 'Test Post to Update',
        description: 'Test Post description'
    };
    var tagData = {
        name: 'Test Tag for Post Update'
    };
    var postDataUpdate = {
        title: 'T',
        description: 'Test Post description not Updated'
    };

    it('should create a Tag', function (done) {
        models.tag.create(tagData).then(function (tag) {
            createdTag = tag;
            postDataUpdate.tags = [tag];
            done();
        });
    });

    it('should create a Post containing a Tag', function (done) {
        models.post.create(postData).then(function (post) {
            createdPost = post;
            done();
        });
    });

    it('should not update an existing Post with a Tag', function (done) {
        server
            .put('/posts/' + createdPost.id)
            .send(postDataUpdate)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.status.should.equal(400);
                res.body.length.should.be.equal(1);
                res.body[0].message.should.be.not.empty;
                res.body[0].path.should.be.equal('title');
            })
            .end(done);
    });

    it('should not be updated in the database', function (done) {
        models.post.findOne({
            where: {
                id: createdPost.id
            },
            include: [{
                model: models.tag,
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            }]
        }).then(function (post) {
            assert.equal(createdPost.id, post.id);
            assert.equal(createdPost.title, post.title);
            assert.equal(createdPost.description, post.description);
            done();
        });
    });
});
