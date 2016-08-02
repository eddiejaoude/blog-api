"use strict";

module.exports = function (sequelize, DataTypes) {
    var tag = sequelize.define("tag", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 24]
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                tag.belongsToMany(models.post, {through: 'post_tag'});
            }
        }
    });

    return tag;
};
