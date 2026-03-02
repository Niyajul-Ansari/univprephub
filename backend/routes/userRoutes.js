const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const PremiumContent = require("../models/PremiumContent");
const CourseSubject = require("../models/CourseSubject");

const upload = require("../middlewares/upload");
const { uploadAvatar, removeAvatar } = require("../controllers/profileController");

/* ========== USER PROFILE ========== */
router.get("/me", auth, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar || null,
            permissions: req.user.permissions,
            assignedCourse: req.user.assignedCourse,
            isApproved: req.user.isApproved
        }
    });
});

/* ========== USER PREMIUM CONTENT (COURSE → SUBJECT → CONTENT) ========== */
router.get("/premium", auth, async (req, res) => {
    try {
        if (!req.user.assignedCourse) {
            return res.json({ success: true, data: [] });
        }

        // ✅ ONLY FIX (no logic change, full string preserved)
        const cleanCourse = req.user.assignedCourse
            .trim()
            .replace(/\s+/g, " ");

        const mapping = await CourseSubject.findOne({
            courseCode: cleanCourse
        });

        if (!mapping || !mapping.subjects?.length) {
            return res.json({ success: true, data: [] });
        }

        const data = await PremiumContent.find({
            isHidden: false,
            subject: {
                $in: mapping.subjects.map(s => s.toLowerCase())
            }
        }).sort({ createdAt: -1 });

        res.json({ success: true, data });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

/* ========== UPLOAD AVATAR ========== */
router.post("/upload-avatar", auth, upload.single("avatar"), uploadAvatar);
router.post("/remove-avatar", auth, removeAvatar);

/* ========== LOGOUT ========== */
router.post("/logout", (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax"
    });
    res.json({ success: true });
});

module.exports = router;