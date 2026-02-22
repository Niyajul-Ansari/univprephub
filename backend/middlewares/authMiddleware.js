
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    // Read token from cookie OR Authorization header (safe way)
    const token =
        req.cookies?.token ||
        req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Login required"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            res.clearCookie("token");
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        // 🔥 ADMIN APPROVAL CHECK
        if (user.role !== "admin" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Admin approval pending"
            });
        }

        req.user = user;
        next();

    } catch (err) {
        res.clearCookie("token");
        return res.status(401).json({
            success: false,
            message: "Token invalid"
        });
    }
};

