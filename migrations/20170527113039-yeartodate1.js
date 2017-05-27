'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('works', 'date', 'year');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameColumn('works', 'year', 'date');
  }
};
