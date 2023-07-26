const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: [true, 'the email is already taken'],
        required: [true, 'Email is required'],
    },
    password: {
        type: String,
        requird: [true, 'Password is required'],
    },

    createdEvents: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event',
        },
    ],
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
