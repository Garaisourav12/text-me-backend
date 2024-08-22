const express = require("express");
const MessageRouter = express.Router();
const {
    sendMessage,
    getMessages,
} = require("../../controllers/messageController");
const isAuthenticated = require("../../middlewares/isAuthenticated");

MessageRouter.post("/send/:id", isAuthenticated, sendMessage);
MessageRouter.get("/get/:id", isAuthenticated, getMessages);

module.exports = MessageRouter;
