const mongoose = require('mongoose');
const { Schema } = mongoose;

const equipmentSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    asset_code: { 
        type: String,
        required: true,
        unique: true
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category', 
        required: true
    },

    location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true
    },
  
    managed_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Equipment', equipmentSchema);