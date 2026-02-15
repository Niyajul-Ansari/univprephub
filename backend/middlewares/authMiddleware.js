// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// module.exports = async (req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.redirect("/login");
//     }

//     try {
//         // 1️⃣ Verify JWT
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 2️⃣ Get fresh user from DB
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             res.clearCookie("token");
//             return res.redirect("/login");
//         }

//         // 3️⃣ 🔥 ADMIN APPROVAL CHECK (MAIN FIX)
//         if (user.role !== "admin" && !user.isApproved) {
//             return res.send("Admin approval pending");
//             // or better: return res.redirect("/approval-pending");
//         }

//         // 4️⃣ Attach real user
//         req.user = user;
//         next();

//     } catch (err) {
//         console.log("JWT Error:", err.message);

//         res.clearCookie("token");
//         return res.redirect("/login");
//     }
// };


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

