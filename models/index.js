// models/index.js

const sequelize = require('../config/config');
const User = require('./User');
const Todo = require('./Todo');
const { Team, TeamMember } = require('./Team');

// Sync the models with the database
const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true }); // `alter: true` will update tables to match models
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Failed to synchronize database:', error);
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    User,
    Todo,
    Team,
    TeamMember
};
