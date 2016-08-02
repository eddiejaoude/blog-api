var models = require('../models');
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    models.tag.findAll({}).then(function (tags) {
        res.json(tags);
    });
});

router.post('/', function (req, res, next) {
    models.tag.create(req.body).then(function (tag) {
        res.status(201).json(tag);
    })
});

router.delete('/:id', function (req, res, next) {
    models.tag.findById(req.params.id).then(function (tag) {
        if (tag === null) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            tag.destroy();
            res.status(204).json({});
        }
    })
});

router.put('/:id', function (req, res, next) {
    models.tag.findById(req.params.id).then(function (tag) {
        if (tag === null) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        } else {
            tag.update(req.body).then(function(tag) {
                res.status(200).json(tag);
            });
        }
    })
});

module.exports = router;
