const Booking = require('../../db/models/Booking');
const Event = require('../../db/models/Event');
const { transformBooking, transformEvent } = require('./merge');

module.exports = {
    bookings: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('User not authenticated!');
        }
        try {
            const bookings = await Booking.find();

            return bookings.map((booking) => {
                return transformBooking(booking);
            });
        } catch (err) {}
    },
    cancelBooking: async ({ bookingId }, req) => {
        if (!req.isAuth) {
            throw new Error('User not authenticated!');
        }
        const booking = await Booking.findById(bookingId).populate('event');

        const event = transformEvent(booking.event);

        await Booking.findByIdAndDelete(bookingId);

        return event;
    },

    bookEvent: async ({ eventId }, req) => {
        if (!req.isAuth) {
            throw new Error('User not authenticated!');
        }
        const fetchedEvent = await Event.findById(eventId);
        const booking = await Booking.create({
            user: '64be793db76fc3e579d18de2',
            event: fetchedEvent.id,
        });

        return transformBooking(booking);
    },
};
