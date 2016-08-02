"use strict";

module.exports = function (sequelize, DataTypes) {
    var post = sequelize.define("post", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 32]
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [12, 512]
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                post.belongsToMany(models.tag, {through: 'post_tag'})
            }
        }
    });

    return post;
};
