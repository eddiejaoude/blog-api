var models = require('../models');
var express = require('express');
var router = express.Router();
var sequelize = require('sequelize')

router.get('/', function (req, res, next) {
    models.tag.findAll({}).then(function (tags) {
        res.json(tags);
    });
});

router.get('/:id', function (req, res, next) {
    models.tag.findOne({
        where: {
            id: req.params.id
        },
        include: [{
            model: models.post,
            // attributes: ['id', 'name'],
            through: {
                attributes: []
            }
        }]
    }).then(function (tag) {
        if (tag) {
            res.json(tag);
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

router.post('/', function (req, res, next) {
    models.tag.create(req.body).then(function (tag) {
        res.status(201).json(tag);
    });
});

router.delete('/:id', function (req, res, next) {
    models.tag.findById(req.params.id).then(function (tag) {
        if (tag) {
            tag.destroy();
            res.status(204).json({});
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

router.put('/:id', function (req, res, next) {
    models.tag.findById(req.params.id).then(function (tag) {
        if (tag) {
            tag.update(req.body).then(function(tag) {
                res.status(200).json(tag);
            });
        } else {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        }
    });
});

module.exports = router;
