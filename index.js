// index.js

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const routes = require('./routes');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Create an HTTP server and integrate it with socket.io
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
})); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

// Middleware to pass io to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

// API Routes
app.use('/api', routes);


// Database connection and server start
const PORT = process.env.PORT || 5000;
sequelize.sync()
    .then(() => {
        console.log('Database connected successfully.');

        // Start the server
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});