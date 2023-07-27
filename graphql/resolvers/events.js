const Event = require('../../db/models/Event');

const User = require('../../db/models/User');

const { transformEvent } = require('./merge');

module.exports = {
    events: async () => {
        const returnedEvents = await Event.find();
        return returnedEvents.map((event) => transformEvent(event));
    },

    createEvent: async ({ eventInput }, req) => {
        // const session = await conn.startSession();
        if (!req.isAuth) {
            throw new Error('User not authenticated!');
        }
        console.log(eventInput);
        try {
            const event = {
                title: eventInput.title,
                description: eventInput.description,
                price: +eventInput.price,
                date: Date.now(),
                creator: req.userId,
            };

            // await session.startTransaction();
            const returnedEvent = await Event.create({ ...event });
            await User.findByIdAndUpdate(req.userId, {
                $push: {
                    createdEvents: returnedEvent._id.toString(),
                },
            });
            // await session.commitTransaction();
            return transformEvent(returnedEvent);
        } catch (err) {
            // await session.abortTransaction();
            console.log(err);
            throw new Error(err);
        }
    },
};
