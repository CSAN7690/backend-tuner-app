const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to Tuner');
});

// Error handling route for unmatched routes
app.use((req, res) => {
    res.status(404).send('404: Route not found');
});

module.exports = app;
