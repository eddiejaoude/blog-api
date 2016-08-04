'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable(
            'tags',
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
                name: Sequelize.STRING
            },
            {
                engine: 'InnoDB', // default: 'InnoDB'
                charset: 'utf8' // default: null
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('tags');
    }
};
