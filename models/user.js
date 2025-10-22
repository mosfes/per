const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: ['user', 'admin'], 
        default: 'user'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
