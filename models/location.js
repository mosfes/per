const mongoose = require('mongoose');
const { Schema } = mongoose;

const locationSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    floor: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);