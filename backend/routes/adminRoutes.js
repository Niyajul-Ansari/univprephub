const express = require("express");
const router = express.Router();

const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

/* ================= ADMIN DASHBOARD ================= */
router.get("/", authMiddleware, adminMiddleware, async (req, res) => {
    const pendingUsers = await User.find({
        role: "user",
        isApproved: false
    });

    res.json({
        success: true,
        pendingUsers
    });
});

/* ================= GET ALL USERS ================= */
router.get("/users", authMiddleware, adminMiddleware, async (req, res) => {
    const users = await User.find({ role: "user" }).select("-password");
    res.json({ success: true, users });
});

/* ================= GRANT PREMIUM ACCESS (VIDEO + DASHBOARD) ================= */
router.post("/grant-premium", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        if (!email || !secretCode) {
            return res.json({
                success: false,
                message: "Email & secret code required"
            });
        }

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or secret code"
            });
        }

        // 🔥 MAIN APPROVAL
        user.isApproved = true;

        await user.save();

        return res.json({
            success: true,
            message: "Premium access granted. User can access dashboard & videos."
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error granting premium access"
        });
    }
});

/* ================= TAKE PREMIUM ACCESS (VIDEO) ================= */
router.post("/take-premium", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        if (!email || !secretCode) {
            return res.json({
                success: false,
                message: "Email & secret code required"
            });
        }

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or secret code"
            });
        }

        // 🔥 MAIN VIDEO REVOKE
        user.isApproved = false;

        await user.save();

        return res.json({
            success: true,
            message: "Premium (Video) access removed"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error removing premium access"
        });
    }
});

/* ================= GRANT PREMIUM NOTES ================= */
router.post("/grant-access", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode, course } = req.body;

        if (!email || !secretCode || !course) {
            return res.json({
                success: false,
                message: "Email, secret code & course required"
            });
        }

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or secret code"
            });
        }

        user.permissions.notes.access = true;

        if (!user.permissions.notes.courses.includes(course)) {
            user.permissions.notes.courses.push(course);
        }

        user.markModified("permissions");
        await user.save();

        res.json({
            success: true,
            message: "Premium Notes access granted"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error granting notes access"
        });
    }
});

/* ================= TAKE PREMIUM NOTES ================= */
router.post("/take-access", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({
                success: false,
                message: "Invalid email or secret code"
            });
        }

        user.permissions.notes = {
            access: false,
            courses: []
        };

        user.markModified("permissions");
        await user.save();

        res.json({
            success: true,
            message: "Premium Notes access removed"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Error removing notes access"
        });
    }
});

module.exports = router;
