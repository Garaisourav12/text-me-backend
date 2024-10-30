const { Server } = require("socket.io");
const http = require("http");
const express = require("express");
const { subscriber, publishLogin, publishLogout } = require("../pubsub");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: true,
		methods: ["GET", "POST"],
	},
});

// Store the loggedin user's socket id who are connected to this server instance
const userSocketMap = {}; // { userId -> [socketId, ...] }

// Store all loggedin user's userId accross the all server instances
const onlineUsers = {}; // { userId -> count of logged-in instances }

// Helper function to get socketId by userId
const getSocketId = (userId) => userSocketMap[userId];

// Helper function to get all online users
const getOnlineUsers = () => Object.keys(onlineUsers);

// React on published message from pubsub
subscriber.on("message", (channel, message) => {
	const data = JSON.parse(message);

	if (channel === "login") {
		onlineUsers[data.userId] = (onlineUsers[data.userId] || 0) + 1;
		io.emit("online", getOnlineUsers());
	} else if (channel === "logout") {
		if (!onlineUsers[data.userId]) return;
		onlineUsers[data.userId] > 1
			? (onlineUsers[data.userId] -= 1)
			: delete onlineUsers[data.userId];
		io.emit("online", getOnlineUsers());
	} else if (channel === "new-message") {
		const { newMessage } = data;

		const recieverSockets = getSocketId(newMessage.receiverId);
		if (recieverSockets) {
			recieverSockets.forEach((socketId) => {
				io.to(socketId).emit("newMessage", newMessage);
			});
		}

		const senderSockets = getSocketId(newMessage.senderId);
		if (senderSockets) {
			senderSockets.forEach((socketId) => {
				io.to(socketId).emit("sentMessage", newMessage);
			});
		}
	}
});

io.on("connection", (socket) => {
	const userId = socket.handshake.query.userId;
	if (userId !== undefined) {
		// Handle multiple loggedin
		if (userId in userSocketMap) {
			userSocketMap[userId].push(socket.id);
		} else {
			userSocketMap[userId] = [socket.id];
		}

		// Publish login event
		publishLogin(userId);
	}

	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		// Don't delete all soceketId
		if (userId in userSocketMap) {
			userSocketMap[userId] = userSocketMap[userId].filter(
				(id) => id !== socket.id
			);
			if (userSocketMap[userId].length === 0) {
				delete userSocketMap[userId];
			}
		}

		// Publish logout event
		publishLogout(userId);

		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

module.exports = { app, io, server, getSocketId };
