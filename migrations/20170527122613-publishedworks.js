'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.renameTable('publishedWorks', 'publishedworks');
  },

  down: function (queryInterface, Sequelize) {
    queryInterface.renameTable('publishedworks', 'publishedWorks');
  }
};
