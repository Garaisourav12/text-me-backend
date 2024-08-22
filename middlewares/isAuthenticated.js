const jwt = require("jsonwebtoken");

module.exports = isAuthenticated = (req, res, next) => {
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        const user = jwt.verify(token, process.env.JWT_SECRET);
    
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    
        req.userId = user.userId;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
}