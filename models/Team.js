const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');

// Team Model
const Team = sequelize.define('Team', {
    teamLeadUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        validate: {
            notEmpty: { msg: 'Team lead user ID cannot be empty' },
            notNull: { msg: 'Team lead user ID is required' },
        },
    },
}, {
    tableName: 'teams',
    timestamps: true,
});

// TeamMembers Model (Junction Table)
const TeamMember = sequelize.define('TeamMember', {
    teamId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Team,
            key: 'id',
        },
        validate: {
            notEmpty: { msg: 'Team ID cannot be empty' },
            notNull: { msg: 'Team ID is required' },
        },
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        validate: {
            notEmpty: { msg: 'Member ID cannot be empty' },
            notNull: { msg: 'Member ID is required' },
        },
    },
}, {
    tableName: 'team_members',
    timestamps: true,
});

// Associations
Team.belongsTo(User, { as: 'teamLead', foreignKey: 'teamLeadUserId' });
Team.belongsToMany(User, { through: TeamMember, as: 'members', foreignKey: 'teamId' });
Team.hasMany(TeamMember, { foreignKey: 'teamId', as: 'teamMembers' });
User.belongsToMany(Team, { through: TeamMember, as: 'teams', foreignKey: 'memberId' });
User.hasMany(Team, { as: 'teamLeadFor', foreignKey: 'teamLeadUserId' });
TeamMember.belongsTo(Team, { foreignKey: 'teamId' });
TeamMember.belongsTo(User, { foreignKey: 'memberId' });

module.exports = { Team, TeamMember };
