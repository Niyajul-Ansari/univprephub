const express = require("express");
const router = express.Router();

const User = require("../models/User");
const PremiumContent = require("../models/PremiumContent");
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

/* ================= ADMIN: GET ALL PREMIUM CONTENT ================= */
router.get(
    "/premium-content",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        try {
            const data = await PremiumContent.find()
                .sort({ createdAt: -1 });

            res.json({
                success: true,
                data
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    }
);

/* ================= GRANT PREMIUM (VIDEO + COURSE) ================= */
router.post("/grant-premium", authMiddleware, adminMiddleware, async (req, res) => {
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

        user.isApproved = true;

        // ✅ ONLY FIX (full string preserved, just cleaned)
        user.assignedCourse = course.trim().replace(/\s+/g, " ");

        await user.save();

        res.json({
            success: true,
            message: "Premium access granted with course"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

/* ================= TAKE PREMIUM ================= */
router.post("/take-premium", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({ success: false });
        }

        user.isApproved = false;
        user.assignedCourse = null;

        await user.save();

        res.json({
            success: true,
            message: "Premium access removed"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

/* ================= GRANT EBOOK ACCESS ================= */
router.post("/grant-access", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({ success: false });
        }

        user.permissions = user.permissions || {};
        user.permissions.ebook = user.permissions.ebook || {};
        user.permissions.ebook.access = true;

        user.markModified("permissions");
        await user.save();

        res.json({
            success: true,
            message: "Ebook access granted"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

/* ================= TAKE EBOOK ACCESS ================= */
router.post("/take-access", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, secretCode } = req.body;

        const user = await User.findOne({ email, secretCode });
        if (!user) {
            return res.json({ success: false });
        }

        user.permissions = user.permissions || {};
        user.permissions.ebook = user.permissions.ebook || {};
        user.permissions.ebook.access = false;

        user.markModified("permissions");
        await user.save();

        res.json({
            success: true,
            message: "Ebook access removed"
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;