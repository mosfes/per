const mongoose = require('mongoose');
const { Schema } = mongoose;

const repairRequestSchema = new Schema({
    
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    equipment: {
        type: Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    assigned_admin: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    problem_description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['รอดำเนินการ', 'กำลังดำเนินการ', 'ซ่อมเสร็จ', 'ยกเลิก'],
        default: 'รอดำเนินการ'
    }
    
}, {
    timestamps: true 
});

module.exports = mongoose.model('RepairRequest', repairRequestSchema);