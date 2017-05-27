'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'first_name', 'name');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('users', 'name', 'first_name');
  }
};
