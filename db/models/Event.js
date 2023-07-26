const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Please add title '] },
    description: { type: String, required: [true, 'Please add description'] },
    price: { type: Number, required: [true, 'Please enter price of event'] },
    date: {
        type: Date,
        required: true,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

const Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;
