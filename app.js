const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db.config.js');
const authRoutes = require('./routes/auth.route.js');
const userRoutes = require('./routes/user.route.js');
const adminRoutes = require('./routes/admin.route.js');
const setupSocket = require('./utils/socket.js');

require('dotenv').config();
connectDB(); // Connect to MongoDB database

const port = process.env.PORT || 4000;

const app = express(); // Create Express app
const server = http.createServer(app); // Create HTTP server
const io = socketIo(server); // Create Socket.io server

app.use(express.json()); // Middleware to parse incoming requests with JSON payloads
app.set('io', io); // Set up socket.io instance

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

setupSocket(io); // Set up socket connection

server.listen(port, () => console.log(`Server running on port ${port}`)); // Start server
