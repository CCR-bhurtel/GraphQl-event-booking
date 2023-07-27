const Event = require('../../db/models/Event');
const User = require('../../db/models/User');
const { dateToString } = require('../../helpers/date');

const transformEvent = (event) => ({
    ...event._doc,
    id: event.id,
    date: dateToString(event._doc.date),
    creator: populateUser.bind(this, event._doc.creator),
});

const transformBooking = (booking) => ({
    ...booking._doc,
    _id: booking.id,
    user: populateUser.bind(this, booking._doc.user),
    event: populateSingleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updateddAt: dateToString(booking._doc.updatedAt),
});

const populateUser = async (userId) => {
    try {
        const returnedUser = await User.findById(userId);
        return {
            ...returnedUser._doc,
            _id: returnedUser.id,
            createdEvents: populateEvents.bind(this, returnedUser._doc.createdEvents),
        };
    } catch (err) {
        console.log(err);
    }
};

const populateEvents = async (eventIds) => {
    try {
        const events = await Event.find({
            _id: {
                $in: eventIds,
            },
        });
        return events.map((event) => {
            return transformEvent(event);
        });
    } catch (err) {
        console.log(err);
    }
};

const populateSingleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);

        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

exports.user = populateUser;
exports.singleEvent = populateSingleEvent;
exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;
// exports.events = events;
