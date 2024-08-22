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

UserRouter.post("/register", register);
UserRouter.post("/login", login);
UserRouter.get("/logout", logout);
UserRouter.get("/get_other_users", isAuthenticated, getOtherUsers);
UserRouter.get("/verify_token", isAuthenticated, verifyToken);

module.exports = UserRouter;
