const Redis = require("ioredis");

// Replace with your actual Redis credentials
const redis = new Redis({
	host: process.env.REDIS_HOST, // e.g., 'localhost' or 'redis-12345.example.com'
	port: process.env.REDIS_PORT, // Default Redis port
	password: process.env.REDIS_PASS, // If a password is set
});

module.exports = redis;
