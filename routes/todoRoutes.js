// routes/todoRoutes.js

const express = require('express');
const todoController = require('../controllers/todoController');
const auth = require('../middleware/auth');

const router = express.Router();

// Route to get all todos for the authenticated user
router.get('/', auth, todoController.getTodos);

// Route to create a new todo item
router.post('/', auth, todoController.createTodo);

// Route to update a specific todo item
router.put('/:id', auth, todoController.updateTodo);

// Route to delete a specific todo item
router.delete('/:id', auth, todoController.deleteTodo);

module.exports = router;
