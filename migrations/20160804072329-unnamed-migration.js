'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'post_tag',
            {
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                postId: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    references: {
                        model: 'posts',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                },
                tagId: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: 'tags',
                        key: 'id'
                    },
                    onUpdate: 'cascade',
                    onDelete: 'cascade'
                }
            },
            {
                indexes: [
                    {
                        name: 'post_tag',
                        unique: true,
                        method: 'BTREE',
                        fields: ['postId', 'tagId']
                    }
                ],
                engine: 'InnoDB', // default: 'InnoDB'
                charset: 'utf8' // default: null
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('post_tag');
    }
};
