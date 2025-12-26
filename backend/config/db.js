const mongoose = require('mongoose');

const connection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to MongoDB');
        });
    } catch (error) {
        console.log('Error connecting to MongoDB:', error);
    }   
};

module.exports = connection;