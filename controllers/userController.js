const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
    isRegistrationDataValid,
    isLoginDataValid,
} = require("../utils/userUtils");

module.exports.register = async (req, res) => {
    const { name, username, email, password, profilePic, gender } = req.body;

    try {
        await isRegistrationDataValid({
            name,
            username,
            email,
            password,
            gender,
        });
    } catch (error) {
        return res.status(400).json({ error });
    }

    try {
        const emailExist = await User.findOne({ email });
        if (emailExist) {
            return res.status(400).json({ error: "Email already exists" });
        }

        const usernameExist = await User.findOne({ username });
        if (usernameExist) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.SALT)
        );

        const user = new User({
            name,
            username,
            email,
            password: hashedPassword,
            profilePic,
            gender,
        });

        const savedUser = await user.save();
        return res.status(201).json({ message: "Registered successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        await isLoginDataValid({ email, password });
    } catch (error) {
        return res.status(400).json({ error });
    }

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        // user not include password
        user = { ...user._doc };
        delete user["password"];

        return res
            .status(200)
            .cookie("token", token, {
                maxAge: 1000 * 60 * 60 * 24,
                httpOnly: true,
                sameSite: "lax",
            })
            .json({
                message: "Logged in successfully",
                user: user,
            });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.logout = async (req, res) => {
    try {
        return res
            .status(200)
            .clearCookie("token")
            .json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.getOtherUsers = async (req, res) => {
    try {
        const users = await User.find({ _id: { $ne: req.userId } }).select(
            "-password"
        );
        return res
            .status(200)
            .json({ message: "Other users retrieved successfully", users });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports.verifyToken = async (req, res) => {
    const userId = req.userId;

    try {
        const user = await User.findById(userId).select(["-password", "-__v"]);

        return res.status(200).json({ user: user });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
