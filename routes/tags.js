var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET tags listing. */
router.get('/', function(req, res, next) {
  models.tag.findAll({}).then(function(tags) {
    res.json(tags);
  });
});

/* POST tag. */
router.post('/', function(req, res, next) {
  models.tag.create(req.body).then(function(tag) {
    res.status(201).json(tag);
  })
});

/* POST tag. */
router.delete('/:id', function(req, res, next) {
  models.tag.findById(req.params.id).then(function(tag) {
    tag.destroy();
  }).then(function() {
    res.status(204).json({});
  })
});

module.exports = router;
