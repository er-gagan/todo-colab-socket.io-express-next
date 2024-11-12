const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Team } = require('../models');
const { Op } = require('sequelize');

const checkUserIsAdmin = async (req) => {

    // Check the user is admin or not
    const user = await User.findByPk(req.user.userId);
    if (user.userRole !== 'admin') {
        return { statusCode: 403, message: 'You are not authorized to perform this action' }
    }
    return { statusCode: 200, message: 'You are authorized to perform this action' }
}

exports.getAllRegularAndTeamLeadUsers = async (req, res) => {
    try {
        // Step 1: Check if the requesting user is an admin
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
        }

        // Step 2: Extract query parameters for pagination, search, sorting, and filters
        const {
            page = 1,
            limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            ...filters
        } = req.query;

        // Step 3: Set offset for pagination
        const offset = (page - 1) * limit;

        // Step 4: Build dynamic where clause for filtering
        const filterConditions = {
            userRole: ['regular-user', 'teamlead'],
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ],
            // Dynamic filters (key-value pairs)
            ...Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'userRole') {
                    if (value) {
                        acc[key] = { [Op.like]: `%${value}%` };
                        return acc;
                    }
                } else {
                    acc[key] = { [Op.like]: `%${value}%` };
                    return acc;
                }
            }, {}),
        };

        // Step 5: Fetch users with pagination, sorting, and filtering
        const { count, rows: users } = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            where: filterConditions,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [[sortBy, sortOrder.toUpperCase()]],
        });

        // Step 6: If no users found, return a 400 response
        if (count === 0) {
            return res.status(400).json({ statusCode: 400, message: 'No users found' });
        }

        // Step 7: Return users with pagination info
        res.status(200).json({
            statusCode: 200,
            message: 'Users fetched successfully',
            data: users,
            pagination: {
                totalRecords: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};


// exports.getAllRegularAndTeamLeadUsers = async (req, res) => {
//     try {
//         // Step 1: Check if the requesting user is an admin
//         const checkAdmin = await checkUserIsAdmin(req);
//         if (checkAdmin.statusCode !== 200) {
//             return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
//         }

//         // Step 2: Extract query parameters for pagination and search
//         const { page = 1, limit = 10, search = '' } = req.query;

//         // Step 3: Set offset for pagination
//         const offset = (page - 1) * limit;

//         // Step 4: Apply searching, pagination, and filtering based on user role
//         const { count, rows: users } = await User.findAndCountAll({
//             attributes: { exclude: ['password'] },
//             where: {
//                 userRole: ['regular-user', 'teamlead'],
//                 [Op.or]: [
//                     { name: { [Op.like]: `%${search}%` } },
//                     { email: { [Op.like]: `%${search}%` } }
//                 ]
//             },
//             limit: parseInt(limit),
//             offset: parseInt(offset),
//             order: [['createdAt', 'DESC']],
//         });

//         // Step 5: If no users found, return a 400 response
//         if (count === 0) {
//             return res.status(400).json({ statusCode: 400, message: 'No users found' });
//         }

//         // Step 6: Return users with pagination info
//         res.status(200).json({
//             statusCode: 200,
//             message: 'Users fetched successfully',
//             data: users,
//             pagination: {
//                 totalRecords: count,
//                 totalPages: Math.ceil(count / limit),
//                 currentPage: parseInt(page),
//                 pageSize: parseInt(limit),
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ statusCode: 500, message: error.message });
//     }
// };


// exports.getAllRegularAndTeamLeadUsers = async (req, res) => {
//     try {
//         const checkAdmin = await checkUserIsAdmin(req);
//         if (checkAdmin.statusCode !== 200) {
//             return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
//         }
//         const users = await User.findAll({ attributes: { exclude: ['password'] }, where: { userRole: ['regular-user', 'teamlead'] } });
//         if (!users) {
//             return res.status(400).json({ statusCode: 400, message: 'Failed to fetch users' });
//         }
//         res.status(200).json({ statusCode: 200, message: 'Users fetched successfully', data: users });
//     } catch (error) {
//         res.status(500).json({ statusCode: 500, message: error.message, });
//     }
// };

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
        }
        if (!id) {
            return res.status(400).json({ statusCode: 400, message: 'User id is required' });
        }
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
        await user.destroy();
        res.status(200).json({ statusCode: 200, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
}

exports.getAllRegularUsers = async (req, res) => {
    try {
        // Step 1: Check if the requester is an admin
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({
                statusCode: checkAdmin.statusCode,
                message: checkAdmin.message,
            });
        }

        // Step 2: Fetch all regular users along with their team leader information
        const users = await User.findAll({
            attributes: ['id', 'name', 'email'], // Only fetching required user attributes
            where: { userRole: 'regular-user' },
            include: [
                {
                    model: Team,
                    as: 'teams',
                    attributes: ['id'],
                    include: [
                        {
                            model: User,
                            as: 'teamLead',
                            attributes: ['id', 'name'], // Fetch team leader's id and name
                        },
                    ],
                },
            ],
        });

        // Step 3: Formatting the response to include team leader details
        const formattedUsers = users.map(user => {
            // Checking if the user belongs to a team and has a team leader
            const team = user.teams?.[0];
            const teamLeader = team?.teamLead;

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                teamLeader: teamLeader
                    ? {
                        id: teamLeader.id,
                        name: teamLeader.name,
                    }
                    : null,
            };
        });

        // Step 4: Handle if no users are found
        if (formattedUsers.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'No regular users found',
            });
        }

        // Step 5: Return the response with formatted users
        res.status(200).json({
            statusCode: 200,
            message: 'Users fetched successfully',
            data: formattedUsers,
        });
    } catch (error) {
        // Handle any server error
        res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};

exports.assignRegularUsersUnderTeamLead = async (req, res) => {
    try {
        // Step 1: Check if the requester is an admin
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({
                statusCode: checkAdmin.statusCode,
                message: checkAdmin.message,
            });
        }

        // Step 2: Validate incoming request data
        const { teamLeadId, userIds } = req.body;
        if (!teamLeadId || !Array.isArray(userIds)) {
            return res.status(400).json({
                statusCode: 400,
                message: 'Team lead ID and user IDs are required',
            });
        }

        // Step 3: Fetch the team lead user
        const teamLead = await User.findByPk(teamLeadId);
        if (!teamLead) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Team lead not found',
            });
        }

        // Step 4: Fetch valid users based on user IDs
        const users = await User.findAll({ where: { id: userIds } });
        if (!users || users.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                message: 'Users not found',
            });
        }

        // Step 5: Check if a team already exists for the team lead
        let team = await Team.findOne({ where: { teamLeadUserId: teamLeadId } });

        if (!team) {
            // If no existing team, create a new one
            team = await Team.create({ teamLeadUserId: teamLeadId });
        }

        // Step 6: Get existing members of the team
        const existingMembers = await team.getMembers({ attributes: ['id'] });
        const existingMemberIds = existingMembers.map(member => member.id);

        // Step 7: Find members to remove and members to add
        const membersToRemove = existingMemberIds.filter(id => !userIds.includes(id));
        const membersToAdd = userIds.filter(id => !existingMemberIds.includes(id));

        // Step 8: Remove users who are no longer part of the team
        if (membersToRemove.length > 0) {
            await team.removeMembers(membersToRemove);
        }

        // Step 9: Add new members to the team
        if (membersToAdd.length > 0) {
            await team.addMembers(membersToAdd);
        }

        // Step 10: Return success response
        res.status(200).json({
            statusCode: 200,
            message: 'Users assigned successfully',
        });
    } catch (error) {
        // Handle server errors
        res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};

exports.getAllAssignedUserUnderTeamLeader = async (req, res) => {
    try {
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
        }
        const { teamLeadId } = req.body;
        if (!teamLeadId) {
            return res.status(400).json({ statusCode: 400, message: 'Team lead id is required' });
        }
        const teamLead = await User.findByPk(teamLeadId);
        if (!teamLead) {
            return res.status(404).json({ statusCode: 404, message: 'Team lead not found' });
        }
        const team = await Team.findOne({ where: { teamLeadUserId: teamLeadId } });
        if (!team) {
            return res.status(404).json({ statusCode: 404, message: 'Team not found' });
        }

        const users = await team.getMembers({
            attributes: { exclude: ['password'] }
        });
        res.status(200).json({ statusCode: 200, message: 'Users fetched successfully', data: users });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
}

exports.getSingleUserDetails = async (req, res) => {
    try {
        // Check if user is admin
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({
                statusCode: checkAdmin.statusCode,
                message: checkAdmin.message,
            });
        }

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                message: 'User ID is required',
            });
        }

        // Fetching single user details
        const user = await User.findOne({
            where: { id },
            attributes: { exclude: ['password'] },
            include: [
                // Fetch teams if user is a member
                {
                    model: Team,
                    as: 'teams', // Teams where this user is a member
                    attributes: ['id', 'teamLeadUserId'],
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
                    attributes: ['id'],
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

        // If user not found
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Sending response with user details and associations
        res.status(200).json({
            statusCode: 200,
            message: 'User details fetched successfully',
            data: user,
        });
    } catch (error) {
        // Error handling
        res.status(500).json({
            statusCode: 500,
            message: error.message,
        });
    }
};


exports.getAllTeamLeadersUnderRegularUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: 'User id is required' });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
        if (user.userRole !== 'regular-user') {
            return res.status(400).json({ statusCode: 400, message: 'User is not a regular user' });
        }
        const teams = await user.getTeams({
            include: [
                {
                    model: User,
                    as: 'teamLead',
                    // attributes: ['id', 'name', 'email'],
                },
            ],
        });
        if (!teams) {
            return res.status(404).json({ statusCode: 404, message: 'Teams not found' });
        }
        res.status(200).json({ statusCode: 200, message: 'Teams fetched successfully', data: teams });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
}

exports.getAllTeamLeadersAndRegularMemberUsersUnderRegularUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: 'User id is required' });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
        if (user.userRole !== 'regular-user') {
            return res.status(400).json({ statusCode: 400, message: 'User is not a regular user' });
        }
        const teams = await user.getTeams({
            include: [
                {
                    model: User,
                    as: 'teamLead',
                },
                {
                    model: User,
                    as: 'members',
                },
            ],
        });
        if (!teams) {
            return res.status(404).json({ statusCode: 404, message: 'Teams not found' });
        }

        const uniqueTeamLeaders = [];
        teams.forEach(team => {
            uniqueTeamLeaders.push(team.teamLead)
        })

        // remove duplicate members
        const uniqueMembers = [];
        teams.forEach(team => {
            team.members.forEach(member => {
                if (!uniqueMembers.some(m => m.id === member.id)) {
                    uniqueMembers.push(member);
                }
            });
        });
        res.status(200).json({ statusCode: 200, message: 'All users fetched successfully', data: [...uniqueTeamLeaders, ...uniqueMembers] });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
}

exports.getAllRegularUsersUnderTeamLead = async (req, res) => {
    try {

        const userId = req.user.userId;
        if (!userId) {
            return res.status(400).json({ statusCode: 400, message: 'User id is required' });
        }
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ statusCode: 404, message: 'User not found' });
        }
        if (user.userRole !== 'teamlead') {
            return res.status(400).json({ statusCode: 400, message: 'User is not a team lead user' });
        }


        const users = await User.findAll({
            where: { userRole: 'regular-user' },
            include: [
                {
                    model: Team,
                    as: 'teamLeadFor', // This alias is for teams led by this user
                    foreignKey: 'teamLeadUserId',
                    attributes: ['id'],
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
        if (!users) {
            return res.status(404).json({ statusCode: 404, message: 'Users not found' });
        }
        res.status(200).json({ statusCode: 200, message: 'Users fetched successfully', data: users });

    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message, });
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        // Step 1: Check if the requesting user is an admin
        const checkAdmin = await checkUserIsAdmin(req);
        if (checkAdmin.statusCode !== 200) {
            return res.status(checkAdmin.statusCode).json({ statusCode: checkAdmin.statusCode, message: checkAdmin.message });
        }

        // Step 2: Extract query parameters for pagination, search, sorting, and filters
        const {
            // page = 1,
            // limit = 10,
            search = '',
            sortBy = 'createdAt',
            sortOrder = 'DESC',
            ...filters
        } = req.query;

        // Step 3: Set offset for pagination
        // const offset = (page - 1) * limit;

        // Step 4: Build dynamic where clause for filtering
        const filterConditions = {
            // userRole: ['regular-user', 'teamlead'],
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ],
            // Dynamic filters (key-value pairs)
            ...Object.entries(filters).reduce((acc, [key, value]) => {
                if (key === 'userRole') {
                    if (value) {
                        acc[key] = { [Op.like]: `%${value}%` };
                        return acc;
                    }
                } else {
                    acc[key] = { [Op.like]: `%${value}%` };
                    return acc;
                }
            }, {}),
        };

        // Step 5: Fetch users with pagination, sorting, and filtering
        const { count, rows: users } = await User.findAndCountAll({
            attributes: { exclude: ['password'] },
            where: filterConditions,
            // limit: parseInt(limit),
            // offset: parseInt(offset),
            order: [[sortBy, sortOrder.toUpperCase()]],
        });

        // Step 6: If no users found, return a 400 response
        if (count === 0) {
            return res.status(400).json({ statusCode: 400, message: 'No users found' });
        }

        // Step 7: Return users with pagination info
        res.status(200).json({
            statusCode: 200,
            message: 'Users fetched successfully',
            data: users,
            // pagination: {
            //     totalRecords: count,
            //     totalPages: Math.ceil(count / limit),
            //     currentPage: parseInt(page),
            //     pageSize: parseInt(limit),
            // }
        });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};