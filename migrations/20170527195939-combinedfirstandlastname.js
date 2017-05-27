'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('users', 'last_name');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.addColumn('users', 'last_name', Sequelize.STRING);

  }
};
