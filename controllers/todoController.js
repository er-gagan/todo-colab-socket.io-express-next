// controllers/todoController.js

const { Op } = require('sequelize');
const { Todo, User, Team, TeamMember } = require('../models');
// Create a new todo
exports.createTodo = async (req, res) => {
    try {
        const { title, description, dueDate, priority, assignedTo, status } = req.body;
        const createdBy = req.user.userId; // Extracted from JWT payload

        const todo = await Todo.create({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            status,
            createdBy
        })
        if (!todo) {
            return res.status(400).json({ statusCode: 400, message: 'Failed to create todo' });
        }
        // Emit new todo to all connected clients via Socket.IO
        req.io.emit('newTodo', todo);

        res.status(201).json({ statusCode: 201, message: 'Todo created successfully', data: todo });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};

exports.getTodos = async (req, res) => {
    const { userId } = req.user;
    if (!userId) {
        return res.status(400).json({ statusCode: 400, message: 'User id is required' });
    }
    const user = await User.findByPk(userId);
    if (!user) {
        return res.status(404).json({ statusCode: 404, message: 'User not found' });
    }
    const userRole = user.userRole;

    // Extract query parameters with default values
    const {
        search = '',
        priority,
        status,
        dueDate,
        createdBy,
        assignedTo,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        page = 1,
        limit = 10,
    } = req.query;
    console.log("req.query=================: ", req.query);
    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    try {
        // Dynamic filters object
        const filters = {
            [Op.and]: [
                search && {
                    [Op.or]: [
                        { title: { [Op.like]: `%${search}%` } },
                        { description: { [Op.like]: `%${search}%` } },
                    ],
                },
                priority && { priority },
                status && { status },
                dueDate && { dueDate },
                createdBy && { createdBy },
                assignedTo && { assignedTo },
            ].filter(Boolean),
        };

        let todos;

        // Admin case
        if (userRole === 'admin') {
            todos = await Todo.findAndCountAll({
                where: filters,
                include: [
                    { model: User, as: 'creator', attributes: { exclude: ['password'] } },
                    { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
                ],
                order: [[sortBy, sortOrder.toUpperCase()]],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
        } else if (userRole === 'teamlead') {
            // Fetch team members under the current team lead
            const team = await Team.findOne({
                where: { teamLeadUserId: userId },
                include: {
                    model: TeamMember,
                    as: 'teamMembers',
                    include: { model: User, attributes: ['id'] },
                },
            });

            const teamMemberIds = team ? team.teamMembers.map(member => member.memberId) : [];

            // Add team members filter
            filters[Op.and].push({
                [Op.or]: [
                    { createdBy: userId },
                    { assignedTo: userId },
                    { createdBy: { [Op.in]: teamMemberIds } },
                ],
            });

            todos = await Todo.findAndCountAll({
                where: filters,
                include: [
                    { model: User, as: 'creator', attributes: { exclude: ['password'] } },
                    { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
                ],
                order: [[sortBy, sortOrder.toUpperCase()]],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
        } else if (userRole === 'regular-user') {
            // Fetch teams where the user is a member
            const userTeams = await TeamMember.findAll({
                where: { memberId: userId },
                include: {
                    model: Team,
                    include: { model: User, as: 'teamLead', attributes: ['id'] },
                },
            });

            const teamLeadIds = userTeams.map(teamMember => teamMember.Team.teamLeadUserId);

            // Add filter for team lead
            filters[Op.and].push({
                [Op.or]: [
                    { createdBy: userId },
                    { assignedTo: userId },
                    { createdBy: { [Op.in]: teamLeadIds } },
                ],
            });

            todos = await Todo.findAndCountAll({
                where: filters,
                include: [
                    { model: User, as: 'creator', attributes: { exclude: ['password'] } },
                    { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
                ],
                order: [[sortBy, sortOrder.toUpperCase()]],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });
        }

        // Calculate total pages
        const totalPages = Math.ceil(todos.count / limit);

        return res.status(200).json({
            statusCode: 200,
            data: todos.rows,
            pagination: {
                totalItems: todos.count,
                totalPages,
                currentPage: parseInt(page),
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        return res.status(500).json({ statusCode: 500, message: error.message });
    }
};



// exports.getTodos = async (req, res) => {
//     const { userId } = req.user; // Assume userId and userRole are coming from middleware (JWT Auth)
//     if (!userId) {
//         return res.status(400).json({ statusCode: 400, message: 'User id is required' });
//     }
//     const user = await User.findByPk(userId);
//     if (!user) {
//         return res.status(404).json({ statusCode: 404, message: 'User not found' });
//     }
//     const userRole = user.userRole;

//     try {
//         let todos;

//         // Admin: Fetch all todos
//         if (userRole === 'admin') {
//             todos = await Todo.findAll({
//                 include: [
//                     { model: User, as: 'creator', attributes: { exclude: ['password'] } },
//                     { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
//                 ],
//             });
//         }

//         // Team Lead: Fetch todos created by team lead, assigned to team lead, and all team members' todos
//         else if (userRole === 'teamlead') {
//             // Find all team members of this team lead
//             const team = await Team.findOne({
//                 where: { teamLeadUserId: userId },
//                 include: { model: User, as: 'members', attributes: ['id'] },
//             });

//             const teamMemberIds = team ? team.members.map(member => member.id) : [];

//             todos = await Todo.findAll({
//                 where: {
//                     [Op.or]: [
//                         { createdBy: userId }, // todos created by team lead
//                         { assignedTo: userId }, // todos assigned to team lead
//                         { createdBy: { [Op.in]: teamMemberIds } }, // todos created by team members
//                     ],
//                 },
//                 include: [
//                     { model: User, as: 'creator', attributes: { exclude: ['password'] } },
//                     { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
//                 ],
//             });
//         }

//         // Regular User: Fetch todos created by self, assigned to self, or created by team lead
//         else if (userRole === 'regular-user') {
//             // Find user's team lead
//             const userTeams = await TeamMember.findAll({
//                 where: { memberId: userId },
//                 include: [{ model: Team, include: [{ model: User, as: 'teamLead' }] }],
//             });

//             const teamLeadIds = userTeams.map(teamMember => teamMember.Team.teamLeadUserId);

//             todos = await Todo.findAll({
//                 where: {
//                     [Op.or]: [
//                         { createdBy: userId }, // todos created by regular user
//                         { assignedTo: userId }, // todos assigned to regular user
//                         { createdBy: { [Op.in]: teamLeadIds } }, // todos created by team lead
//                     ],
//                 },
//                 include: [
//                     { model: User, as: 'creator', attributes: { exclude: ['password'] } },
//                     { model: User, as: 'assignee', attributes: { exclude: ['password'] } },
//                 ],
//             });
//         }

//         return res.status(200).json({ statusCode: 200, message: "Todos fetched successfully", data: todos });
//     } catch (error) {
//         console.error('Error fetching todos:', error);
//         return res.status(500).json({ statusCode: 500, message: error.message });
//     }
// };


// exports.getTodos = async (req, res) => {
//     try {
//         const createdBy = req.user.userId; // Authenticated user
//         // Get User
//         if (!createdBy) {
//             return res.status(404).json({ statusCode: 404, message: 'User not found' });
//         }
//         const user = await User.findByPk(createdBy);
//         if (!user) {
//             return res.status(404).json({ statusCode: 404, message: 'User not found' });
//         }
//         console.log("user", user);
//         const {
//             id = null,
//             page = 1,
//             limit = 10,
//             search = '',
//             sortBy = 'createdAt',
//             sortOrder = 'DESC',
//             keyName,
//             value,
//             keyValue,
//             startDate,
//             endDate,
//         } = req.query;

//         const buildResponse = (message, data = null, pagination = null, statusCode = 200) => {
//             return res.status(statusCode).json({ message, statusCode, data, pagination });
//         };

//         const commonIncludeOptions = [
//             {
//                 model: User,
//                 as: 'creator',
//                 attributes: { exclude: ['password'] },
//                 // attributes: ['id', 'name'],
//             },
//             {
//                 model: User,
//                 as: 'assignee',
//                 attributes: { exclude: ['password'] },
//                 // attributes: ['id', 'name'],
//             },
//         ];

//         const fetchTodosWithPagination = async (whereClause) => {
//             const offset = (page - 1) * limit;
//             const { count, rows } = await Todo.findAndCountAll({
//                 where: whereClause,
//                 limit: parseInt(limit),
//                 offset: parseInt(offset),
//                 order: [[sortBy, sortOrder.toUpperCase()]],
//                 include: commonIncludeOptions,
//             });

//             return buildResponse("Todos fetched successfully", rows, {
//                 totalItems: count,
//                 currentPage: parseInt(page),
//                 totalPages: Math.ceil(count / limit),
//                 itemsPerPage: parseInt(limit),
//             });
//         };

//         // Set up the main where clause
//         let whereClause;
//         if (user.userRole === 'admin') {
//             whereClause = {};
//         } else {
//             whereClause = { createdBy };
//         }

//         // Add search filter
//         if (search) {
//             whereClause[Op.or] = [
//                 { title: { [Op.like]: `%${search}%` } },
//                 { description: { [Op.like]: `%${search}%` } },
//             ];
//         }

//         // Add date range filtering if both startDate and endDate are provided
//         if (startDate && endDate) {
//             whereClause.createdAt = {
//                 [Op.between]: [new Date(startDate), new Date(endDate)],
//             };
//         }

//         // Handle specific keyName and value filtering
//         if (keyName && value) {
//             whereClause[keyName] = value;
//         }

//         // Handle dynamic JSON key-value filter
//         if (keyValue) {
//             try {
//                 const keyValueJson = JSON.parse(keyValue);
//                 if (Object.keys(keyValueJson).length === 0) throw new Error();
//                 Object.assign(whereClause, keyValueJson);
//             } catch {
//                 return buildResponse("Invalid JSON object", null, null, 400);
//             }
//         }

//         // Fetch single Todo by ID
//         if (id) {
//             const todo = await Todo.findByPk(id, {
//                 include: commonIncludeOptions,
//             });
//             if (!todo) return buildResponse("Todo not found", null, null, 404);
//             return buildResponse("Todo fetched successfully", todo);
//         }

//         // Fetch all Todos with pagination
//         return await fetchTodosWithPagination(whereClause);

//     } catch (error) {
//         return res.status(500).json({ statusCode: 500, message: error.message });
//     }
// };

// Update a todo
exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate, priority, assignedTo, status } = req.body;
        const createdBy = req.user.userId;

        const todo = await Todo.findOne({ where: { id, createdBy } });

        if (!todo) {
            return res.status(404).json({ statusCode: 404, message: 'Todo not found' });
        }

        todo.title = title;
        todo.description = description;
        todo.dueDate = dueDate;
        todo.priority = priority;
        todo.assignedTo = assignedTo;
        todo.status = status;
        await todo.save();

        req.io.emit('updateTodo', todo); // Emit updated todo to all clients

        res.status(200).json({ statusCode: 200, message: 'Todo updated successfully', data: todo });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        const todo = await Todo.findByPk(id);

        if (!todo) {
            return res.status(404).json({ statusCode: 404, message: 'Todo not found' });
        }

        await todo.destroy();

        req.io.emit('deleteTodo', id); // Emit deleted todo ID to all clients

        res.status(200).json({ statusCode: 200, message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ statusCode: 500, message: error.message });
    }
};
