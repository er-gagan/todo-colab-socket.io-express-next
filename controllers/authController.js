// controllers/authController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Team } = require('../models');

// Register a new user
exports.register = async (req, res) => {
    try {
        const { name, email, userRole, password } = req.body;

        // Check if user already exists, 
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ statusCode: 400, message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await User.create({ name, email, userRole, password: hashedPassword });
        if (!newUser) {
            return res.status(400).json({ statusCode: 400, message: 'Failed to create user' });
        }

        res.status(201).json({ statusCode: 201, message: 'User registered successfully', data: newUser });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid email or password' });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ statusCode: 400, message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        if (!token) {
            return res.status(400).json({ statusCode: 400, message: 'Failed to generate token' });
        }
        res.status(200).json({ statusCode: 200, message: 'You are logged in successfully', data: { token } });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
};

exports.getUserData = async (req, res) => {
    try {
        const id = req.user.userId
        // const user = await User.findByPk(req.user.userId, { attributes: { exclude: ['password'] } });

        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ['password'] },
            include: [
                // Fetch teams if user is a member
                {
                    model: Team,
                    as: 'teams', // Teams where this user is a member
                    // attributes: ['id', 'teamLeadUserId'],
                    include: [
                        {
                            model: User,
                            as: 'teamLead',
                            attributes: { exclude: ['password'] },
                            // attributes: ['id', 'name', 'email'],
                        },
                        {
                            model: User,
                            as: 'members',
                            attributes: { exclude: ['password'] },
                            // attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
                // Fetch team where user is a team lead
                {
                    model: Team,
                    as: 'teamLeadFor', // This alias is for teams led by this user
                    foreignKey: 'teamLeadUserId',
                    // attributes: ['id'],
                    include: [
                        {
                            model: User,
                            as: 'members',
                            attributes: { exclude: ['password'] },
                            // attributes: ['id', 'name', 'email'],
                        },
                    ],
                },
            ],
        });

        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
        res.status(200).json({ statusCode: 200, message: 'User data fetched successfully', data: user });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
}