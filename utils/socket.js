const scheduleNotificationDelivery = require('./queuedNotificationCron.js')

// Function to set up socket connection
const setupSocket = (io) => {
    io.on('connection', (socket) => {
        console.log(`New connection: ${socket.id}`);

        // When a user logs in, they join a room named after their userId
        socket.on('userConnected', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room ${userId}`);
        });

        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    // Run cron job to deliver queued notifications every minute
    scheduleNotificationDelivery(io);
};

module.exports =  setupSocket ;
