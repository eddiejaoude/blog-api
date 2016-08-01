var models  = require('../models');
var express = require('express');
var router = express.Router();

/* GET posts listing. */
router.get('/', function(req, res, next) {
  models.post.findAll({
    include: [ models.tag ]
  }).then(function(posts) {
    res.json(posts);
  });
});

/* POST post. */
/* @TODO: should be done in a transaction */
router.post('/', function(req, res, next) {

  if (req.body.tags === undefined) {
    models.post.create(req.body).then(function(post) {
      res.status(201).json(post);
    });
  } else {
    // find existing tags
    models.tag.findAll({
      where: {
        id: {
          $in: [req.body.tags.map(function(tag) {return tag.id;})]
        }
      }
    }).then(function(tags) {
      // create post
      models.post.create(req.body).then(function(post) {
        // assign tags to post
        post.setTags(tags).then(function(tags) {
          models.post.findOne({
            where: {id: post.id},
            include: [{
              model: models.tag,
              attributes: ['id', 'name'],
              through: {
                attributes: []
              }
            }],
          }).then(function(postWithTags) {
            res.status(201).json(postWithTags);
          });
        });
      });
    });
  }

});


module.exports = router;
