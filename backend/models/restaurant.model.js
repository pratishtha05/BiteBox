const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    restaurantId: {
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
    address: {
        type: String,
        required: true,
    }
});

const restaurantModel = mongoose.model('restaurant', restaurantSchema);

module.exports = restaurantModel;