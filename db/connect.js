const { default: mongoose } = require('mongoose');

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((res) => {
        console.log('Database connected');
    });

const conn = mongoose.connection;

conn.on('error', () => console.error.bind(console, 'Connection error'));
conn.on('once', () => console.log('Connection initiated'));

exports.conn = conn;
