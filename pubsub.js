const Redis = require("ioredis");

// Replace with your actual Redis credentials
const publisher = new Redis({
	host: process.env.REDIS_HOST, // e.g., 'localhost' or 'redis-12345.example.com'
	port: process.env.REDIS_PORT, // Default Redis port
	password: process.env.REDIS_PASS, // If a password is set
});

const subscriber = new Redis({
	host: process.env.REDIS_HOST, // e.g., 'localhost' or 'redis-12345.example.com'
	port: process.env.REDIS_PORT, // Default Redis port
	password: process.env.REDIS_PASS, // If a password is set
});

subscriber.subscribe("login", "logout", "new-message");

const publishLogin = (userId) => {
	publisher.publish("login", JSON.stringify({ userId }));
};

const publishLogout = (userId) => {
	publisher.publish("logout", JSON.stringify({ userId }));
};

const publishMessage = (message) => {
	publisher.publish("new-message", JSON.stringify({ newMessage: message }));
};

module.exports = {
	subscriber,
	publishLogin,
	publishLogout,
	publishMessage,
};
