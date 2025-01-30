const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: { 
        type: String, 
        unique: true 
    },
    password: {
        type: String
    },
    mobileNumber: {
        type: String
    },
    bio: {
        type: String
    },
    role: { 
        type: String, 
        enum: ['user', 'admin'],  // Enum values for role
        default: 'user' 
    },
    availabilityTime: [{ 
        start: {
            type: String
        },
        end: {
            type: String
        }
    }]
});

module.exports = mongoose.model('User', userSchema);
