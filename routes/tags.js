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


module.exports = router;
