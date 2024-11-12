const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./User');

const Todo = sequelize.define('Todo', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Title cannot be empty' },
            notNull: { msg: 'Title cannot be null' },
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Description cannot be empty' },
            notNull: { msg: 'Description cannot be null' },
        },
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
            notEmpty: { msg: 'Due date cannot be empty' },
            notNull: { msg: 'Due date cannot be null' },
        },
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'low',
        validate: {
            isIn: [['low', 'medium', 'high']],
            notEmpty: { msg: 'Priority cannot be empty' },
            notNull: { msg: 'Priority cannot be null' },
        },
    },
    status: {
        type: DataTypes.ENUM('pending', 'in-progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
        validate: {
            isIn: [['pending', 'in-progress', 'completed']],
            notEmpty: { msg: 'Status cannot be empty' },
            notNull: { msg: 'Status cannot be null' },
        },
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        validate: {
            notEmpty: { msg: 'Assigned to cannot be empty' },
            notNull: { msg: 'Assigned to cannot be null' },
        },
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
        validate: {
            notEmpty: { msg: 'Created by cannot be empty' },
            notNull: { msg: 'Created by cannot be null' },
        },
    },
}, {
    tableName: 'todos',
    timestamps: true,
});

// Associations
User.hasMany(Todo, { foreignKey: 'createdBy', as: 'createdTodos' });
User.hasMany(Todo, { foreignKey: 'assignedTo', as: 'assignedTodos' });
Todo.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Todo.belongsTo(User, { foreignKey: 'assignedTo', as: 'assignee' });

module.exports = Todo;
