const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminId: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: { 
        type: String,
        required: true,
        minlength: 6
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    }
});

const adminModel = mongoose.model('admin', adminSchema);

module.exports = adminModel;