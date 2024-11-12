const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [2, 50],
            notEmpty: {
                msg: 'Name cannot be empty'
            },
            notNull: {
                msg: 'Name cannot be null'
            },
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
            notEmpty: {
                msg: 'Email cannot be empty'
            },
            notNull: {
                msg: 'Email cannot be null'
            },
            len: [5, 50],
            is: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
            isEmail: {
                msg: 'Invalid email format'
            }
        },
    },
    userRole: {
        type: DataTypes.ENUM('regular-user', 'teamlead', 'admin'),
        allowNull: false,
        defaultValue: 'regular-user',
        validate: {
            isIn: [['regular-user', 'teamlead', 'admin']],
            notEmpty: {
                msg: 'User role cannot be empty'
            },
            notNull: {
                msg: 'User role cannot be null'
            },
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Password cannot be empty'
            },
            notNull: {
                msg: 'Password cannot be null'
            },
        },
    },
}, {
    tableName: 'users',
    timestamps: true,
});

module.exports = User;
