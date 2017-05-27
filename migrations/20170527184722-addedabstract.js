'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.addColumn('works', 'abstract', Sequelize.STRING);
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.removeColumn('works', 'abstract');
  }
};
