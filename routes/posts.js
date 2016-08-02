var models = require('../models');
var express = require('express');
var router = express.Router();
var sequelize = require('sequelize');

router.get('/', function (req, res, next) {
    models.post.findAll({
        include: [{
            model: models.tag,
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    }).then(function (posts) {
        res.json(posts);
    });
});

router.get('/:id', function (req, res, next) {
    models.post.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: models.tag,
            attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    }).then(function (post) {
        if (post) {
            res.json(post);
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

/* @TODO: should be done in a transaction */
router.post('/', function (req, res, next) {
    if (req.body.tags === undefined) {
        models.post.create(req.body).then(function (post) {
            res.status(201).json(post);
        }).catch(sequelize.ValidationError, function (err) {
            res.status(400).json(err.errors);
        });
    } else {
        // find existing tags
        models.tag.findAll({
            where: {
                id: {
                    $in: [req.body.tags.map(function (tag) {
                        return tag.id;
                    })]
                }
            }
        }).then(function (tags) {
            // create post
            models.post.create(req.body).then(function (post) {
                // assign tags to post
                post.setTags(tags).then(function (tags) {
                    models.post.findOne({
                        where: {id: post.id},
                        include: [{
                            model: models.tag,
                            attributes: ['id', 'name'],
                            through: {
                                attributes: []
                            }
                        }]
                    }).then(function (postWithTags) {
                        res.status(201).json(postWithTags);
                    });
                });
            }).catch(sequelize.ValidationError, function (err) {
                res.status(400).json(err.errors);
            });
        });
    }

});

router.delete('/:id', function (req, res, next) {
    models.post.findById(req.params.id).then(function (post) {
        if (post) {
            post.destroy();
            res.status(204).json({});
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

router.put('/:id', function (req, res, next) {
    models.post.findById(req.params.id).then(function (post) {
        if (post === null) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            if (req.body.tags === undefined) {
                post.update(req.body).then(function (post) {
                    res.status(200).json(post);
                }).catch(sequelize.ValidationError, function (err) {
                    res.status(400).json(err.errors);
                });
            } else {
                // find existing tags
                models.tag.findAll({
                    where: {
                        id: {
                            $in: [req.body.tags.map(function (tag) {
                                return tag.id;
                            })]
                        }
                    }
                }).then(function (tags) {
                    // create post
                    post.update(req.body).then(function (post) {
                        // assign tags to post
                        post.setTags(tags).then(function (tags) {
                            models.post.findOne({
                                where: {id: post.id},
                                include: [{
                                    model: models.tag,
                                    attributes: ['id', 'name'],
                                    through: {
                                        attributes: []
                                    }
                                }]
                            }).then(function (postWithTags) {
                                res.status(200).json(postWithTags);
                            });
                        });
                    }).catch(sequelize.ValidationError, function (err) {
                        res.status(400).json(err.errors);
                    });
                });
            }
        }
    });
});

module.exports = router;
