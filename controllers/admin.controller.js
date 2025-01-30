const Notification = require('../models/notification.model.js');
const User = require('../models/user.model.js');
const isUserAvailable = require('../utils/userAvailability.js');

// controller to send notification by admin
const sendNotification = async (req, res) => {
    try {
        if(req.user.role !== 'admin') {
            return res.status(403).json({ message: "Unauthorized" }); // Only admin can send notifications
        }
        const { recipients, message, type } = req.body;
        if (!recipients || !message || !type) {
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        for (const recipientId of recipients) {
            const recipient = await User.findById(recipientId);

            if (!recipient) return res.status(404).json({  // Check if recipient exists
                success: false,
                message: "Recipient not found" 
            }); 

            const isAvailable = isUserAvailable(recipient.availabilityTime); // Check if user is available
            const newNotification = new Notification({ senderId: req.user.id, recipientId, message, type, status: 'pending' });

            if (isAvailable || type === 'critical') {                // Send notification if user is available or if it is a critical notification
                const io= req.app.get('io');                         // Get socket.io instance
                io.to(recipientId).emit('receiveNotification', {     // Emit event to recipient
                    message: newNotification.message,
                    timestamp: newNotification.timestamp
                });
                newNotification.status = 'delivered';
            }
            await newNotification.save();
        }

        return res.status(200).json({ 
            success: true,
            message: "Notification Sent" 
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error
         });
    }
};

module.exports = { sendNotification };
