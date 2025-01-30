const mongoose = require('mongoose');

// Define Notification schema
const notificationSchema = new mongoose.Schema({
    senderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',   // Reference to User model
        required: true 
    },
    recipientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'  // Reference to User model
    },
    message: { 
        type: String
     },
    status: { 
        type: String, 
        enum: ['pending', 'delivered'],  // Enum values for status
        default: 'pending' 
    },
    type: { 
        type: String, 
        enum: ['critical', 'nonCritical'],  // Enum values for type
        default: 'nonCritical'
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
