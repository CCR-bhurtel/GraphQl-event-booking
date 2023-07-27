const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

userSchema.methods.comparePasswords = async (providedPassword, existingPasswordHash) => {
    const isPasswordEqual = await bcrypt.compare(providedPassword, existingPasswordHash);
    return isPasswordEqual;
};
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
