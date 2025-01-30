const cron = require('node-cron');
const Notification = require('../models/notification.model.js');
const User = require('../models/user.model.js');
const isUserAvailable = require('./userAvailability.js');

// Function to schedule notification delivery when user is available
const scheduleNotificationDelivery = (io) => {
    cron.schedule('* * * * *', async () => {  // Run every minute
        try {
            console.log("Running cron job: Checking queued notifications...");

            const notifications = await Notification.find({ status: 'pending' }).populate('recipientId'); // Find pending notifications

            for (const notification of notifications) {
                const isAvailable = isUserAvailable(notification.recipientId.availibilityTime);  // Check if user is available
                if (isAvailable) {
                    // Send the queued notification
                    io.to(notification.recipientId).emit('receiveNotification', {
                        message: notification.message,
                        timestamp: notification.timestamp
                    });

                    // Mark as delivered
                    await Notification.findByIdAndUpdate(notification._id, { status: 'delivered' });  // Update notification status
                    console.log(`Queued notification delivered to ${notification.recipientId}`);
                }
            }
        } catch (error) {
            console.error('Error delivering queued notifications:', error);
        }
    });
};

module.exports =  scheduleNotificationDelivery ;