const User = require('../models/user.model.js');
const Notification = require('../models/notification.model.js');
const isUserAvailable = require('../utils/userAvailability.js');

// controller to update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, mobileNumber, bio, availabilityTime } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, mobileNumber, bio, availabilityTime }, { new: true }); // Update user profile data
        if(!updatedUser) {
            return res.status(404).json({    // Check if user exists
                success: false,
                message: "User not found" 
            }); 
        }
        return res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error 
        });
    }
};


// controller to send notification by user
const sendNotification = async (req, res) => {
    try {
        const { recipients, message } = req.body;
        if (!recipients || !message ) {  // Check for required fields
            return res.status(400).json({ 
                success: false,
                message: "Missing required fields" 
            });
        }

        for (const recipientId of recipients) {
            const recipient = await User.findById(recipientId); // Check if recipient exists
            if (!recipient) {
                return res.status(404).json({ 
                    success: false,
                    message: "Recipient not found" });
            }

            const isAvailable = true  
            if(recipient.availabilityTime && recipient.availabilityTime.length > 0) {
                isAvailable = isUserAvailable(recipient.availabilityTime);   // Check if user is available
            }
            const newNotification = new Notification({ senderId: req.user.id, recipientId, message, status: 'pending' });

            if (isAvailable) {
                const io= req.app.get('io');   // Get socket.io instance
                io.to(recipientId).emit('receiveNotification', {   // Emit event to recipient
                    message: newNotification.message,
                    timestamp: newNotification.timestamp
                });
                newNotification.status = 'delivered';  // Mark as delivered
            }
            await newNotification.save();
        }

        return res.status(200).json({ 
            success: true,
            message: "Notification Sent" 
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ 
            success: false,
            message: "Internal Server Error", 
            error 
        });
    }
};

module.exports = { updateProfile, sendNotification };