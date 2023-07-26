const Booking = require('../../db/models/Booking');
const Event = require('../../db/models/Event');
const User = require('../../db/models/User');
const bcrypt = require('bcryptjs');
const { dateToString } = require('../../helpers/date');

const transformEvent = (event) => ({
    ...event._doc,
    id: event.id,
    date: dateToString(event._doc.date),
    creator: user.bind(this, event._doc.creator),
});

const transformBooking = (booking) => ({
    ...booking._doc,
    _id: booking.id,
    user: user.bind(this, booking._doc.user),
    event: singleEvent.bind(this, booking._doc.event),
    createdAt: dateToString(booking._doc.createdAt),
    updateddAt: dateToString(booking._doc.updatedAt),
});

const user = async (userId) => {
    try {
        const returnedUser = await User.findById(userId);
        return {
            ...returnedUser._doc,
            _id: returnedUser.id,
            createdEvents: events.bind(this, returnedUser._doc.createdEvents),
        };
    } catch (err) {
        console.log(err);
    }
};

const events = async (eventIds) => {
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

const singleEvent = async (eventId) => {
    try {
        const event = await Event.findById(eventId);

        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        const returnedEvents = await Event.find();
        return returnedEvents.map((event) => transformEvent(event));
    },

    bookings: async () => {
        try {
            const bookings = await Booking.find();

            return bookings.map((booking) => {
                return transformBooking(booking);
            });
        } catch (err) {}
    },
    createEvent: async ({ eventInput }) => {
        // const session = await conn.startSession();

        try {
            const event = {
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: Date.now(),
                creator: '64be793db76fc3e579d18de2',
            };

            // await session.startTransaction();
            const returnedEvent = await Event.create({ ...event });
            await User.findByIdAndUpdate('64be793db76fc3e579d18de2', {
                $push: {
                    createdEvents: returnedEvent._id.toString(),
                },
            });
            // await session.commitTransaction();
            return transformEvent(returnedEvent);
        } catch (err) {
            // await session.abortTransaction();
            console.log(err);
        }
    },

    createUser: ({ userInput }) => {
        try {
            return bcrypt
                .hash(userInput.password, 12)
                .then(async (hashedPassword) => {
                    const user = {
                        email: userInput.email,
                        password: hashedPassword,
                    };

                    const returnedUser = await User.create({ ...user });
                    return { ...returnedUser._doc, password: null };
                })

                .catch((err) => {
                    if (err.code == '11000') {
                        const errorKey = Object.keys(err.keyPattern)[0];
                        throw new Error(`The ${errorKey} ${err.keyValue[errorKey]} already exists.`);
                    }
                    throw err;
                });
        } catch (err) {
            console.log(err);
        }
    },

    cancelBooking: async ({ bookingId }) => {
        const booking = await Booking.findById(bookingId).populate('event');

        const event = transformEvent(booking.event);

        await Booking.findByIdAndDelete(bookingId);

        return event;
    },

    bookEvent: async ({ eventId }) => {
        const fetchedEvent = await Event.findById(eventId);
        const booking = await Booking.create({
            user: '64be793db76fc3e579d18de2',
            event: fetchedEvent.id,
        });

        return transformBooking(booking);
    },
};
