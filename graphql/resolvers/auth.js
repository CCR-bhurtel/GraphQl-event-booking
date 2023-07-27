const User = require('../../db/models/User');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
module.exports = {
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

    login: async ({ email, password }) => {
        const user = await User.findOne({ email });

        if (!user) throw new Error('User doesnot exist');

        const isPasswordCorrect = await user.comparePasswords(password, user._doc.password);

        if (!isPasswordCorrect) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            'supersecretkeyforjsontokenthatisunknowntoanybeingalive',
            {
                expiresIn: '5h',
            }
        );

        return { userId: user._id, token, tokenExpiration: '5' };
    },
};
