var models = require('../models');
var express = require('express');
var router = express.Router();

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
        res.json(post);
    });
});

/* @TODO: should be done in a transaction */
router.post('/', function (req, res, next) {

    if (req.body.tags === undefined) {
        models.post.create(req.body).then(function (post) {
            res.status(201).json(post);
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
                        }],
                    }).then(function (postWithTags) {
                        res.status(201).json(postWithTags);
                    });
                });
            });
        });
    }

});

router.delete('/:id', function (req, res, next) {
    models.post.findById(req.params.id).then(function (post) {
        if (post === null) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            post.destroy();
            res.status(204).json({});
        }
    })
});

module.exports = router;
