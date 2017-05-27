const Sequelize = require('sequelize');

const connectionUrl = 'postgres://webeng:webeng@localhost:5432/research_archive';

const database = new Sequelize(connectionUrl);

module.exports = database;