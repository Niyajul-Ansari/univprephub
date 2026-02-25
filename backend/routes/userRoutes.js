const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const PremiumContent = require("../models/PremiumContent");

/* ========== USER PROFILE ========== */
router.get("/me", auth, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar || "https://i.pravatar.cc/150?img=12",
            assignedCourse: req.user.assignedCourse
        }
    });
});

/* ========== USER PREMIUM CONTENT (COURSE BASED) ========== */
router.get("/premium", auth, async (req, res) => {
    try {
        if (!req.user.assignedCourse) {
            return res.json({
                success: true,
                data: []
            });
        }

        const data = await PremiumContent.find({
            isHidden: false,
            course: req.user.assignedCourse
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

/* ========== LOGOUT ========== */
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax"
    });
    res.json({ success: true });
});

module.exports = router;