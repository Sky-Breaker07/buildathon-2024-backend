const mongoose = require('mongoose');

const superAdminSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    sex: {
        type: String,
        enum: ['Male', 'Female'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    staff_id: {
        type: String,
        required: true,
    },
 })