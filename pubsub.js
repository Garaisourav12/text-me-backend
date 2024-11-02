const redis = require("./redis");

const publisher = redis.duplicate(); // Create a new client to publish messages

const subscriber = redis.duplicate(); // Create a new client to subscribe to messages

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
