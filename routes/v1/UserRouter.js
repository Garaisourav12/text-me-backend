const express = require("express");
const UserRouter = express.Router();
const {
	register,
	login,
	logout,
	getOtherUsers,
	verifyToken,
} = require("../../controllers/userController");
const isAuthenticated = require("../../middlewares/isAuthenticated");
const cachingMiddleware = require("../../middlewares/cachingMiddleware");

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/logout", isAuthenticated, logout);
UserRouter.get("/get_other_users", isAuthenticated, getOtherUsers);
UserRouter.get(
	"/verify_token",
	isAuthenticated,
	cachingMiddleware,
	verifyToken
);

module.exports = UserRouter;
