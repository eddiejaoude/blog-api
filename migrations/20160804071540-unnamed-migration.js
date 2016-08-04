'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'posts',
            {
                id: {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                createdAt: {
                    type: Sequelize.DATE
                },
                updatedAt: {
                    type: Sequelize.DATE
                },
                title: Sequelize.STRING,
                description: Sequelize.STRING
            },
            {
                engine: 'InnoDB', // default: 'InnoDB'
                charset: 'utf8' // default: null
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('posts');
    }
};
