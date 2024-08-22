const validator = require("validator");

module.exports.isRegistrationDataValid = ({
    name,
    email,
    username,
    password,
    gender,
}) => {
    return new Promise((resolve, reject) => {
        if (!name || !email || !username || !password || !gender) {
            reject("All fields are required");
        } else if (!validator.isEmail(email)) {
            reject("Invalid email");
        } else if (!validator.isAlphanumeric(username)) {
            reject("Username must be alphanumeric");
        } else if (!validator.isLength(username, { min: 6, max: 20 })) {
            reject("Username must be between 6 and 20 characters");
        } else if (!validator.isLength(password, { min: 6, max: 20 })) {
            reject("Password must be between 6 and 20 characters");
        } else if (!["male", "female", "other"].includes(gender)) {
            reject("Invalid gender");
        } else {
            resolve();
        }
    });
};

module.exports.isLoginDataValid = ({ email, password }) => {
    return new Promise((resolve, reject) => {
        if (!email || !password) {
            reject("All fields are required");
        }

        resolve();
    });
};
