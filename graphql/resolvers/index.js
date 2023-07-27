const Booking = require('../../db/models/Booking');
const Event = require('../../db/models/Event');
const User = require('../../db/models/User');
const authResolver = require('./auth');
const eventsResolver = require('./events');
const bookingsResolver = require('./bookings');
module.exports = {
    ...authResolver,
    ...eventsResolver,
    ...bookingsResolver,
};
