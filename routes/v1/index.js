const express = require("express");
const v1ApiRouter = express.Router();

const userRoutes = require("./UserRouter");
const messageRoutes = require("./MessageRouter");

v1ApiRouter.use("/user", userRoutes);
v1ApiRouter.use("/message", messageRoutes);

module.exports = v1ApiRouter;
