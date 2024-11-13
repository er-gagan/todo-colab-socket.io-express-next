// api/server.js
const app = require('../index'); // Import your Express app

module.exports = (req, res) => {
    app(req, res); // Export as a serverless function
};
