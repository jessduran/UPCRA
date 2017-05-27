const Sequelize = require('sequelize');
const database = require('./database');

const User = database.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false,
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: true
});
const Work = database.define('works', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	title: {
		type: Sequelize.STRING
	},
	date: {
		type: Sequelize.DATEONLY
	},
	file: {
		type: Sequelize.STRING
	},
	field: {
		type: Sequelize.STRING
	},
	abstract: {
		type: Sequelize.STRING
	}
}, {
	timestamps: true
});
const PublishedWork = database.define('publishedworks', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	}, 
	user_id: {
		type: Sequelize.INTEGER,
		references: {
			model: 'users',
			key: 'id'
		}
	},
	work_id: {
		type: Sequelize.INTEGER,
		references: {
			model: 'works',
			key: 'id'
		}
	}
}, {
	timestamps: true
});

database.sync();
module.exports.User = User;
module.exports.Work = Work;
module.exports.PublishedWork = PublishedWork;