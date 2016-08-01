"use strict";

module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define("post", {
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        post.belongsToMany(models.tag, {through: 'post_tag'})
      }
    }
  });

  return post;
};
