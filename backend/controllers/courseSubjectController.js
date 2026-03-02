const PremiumContent = require("../models/PremiumContent");
const CourseSubject = require("../models/CourseSubject");

/* ========== GET AVAILABLE SUBJECTS ========== */
exports.getAvailableSubjects = async (req, res) => {
    const subjects = await PremiumContent.aggregate([
        { $match: { isHidden: false } },
        { $group: { _id: "$subject" } },
        { $project: { _id: 0, subject: "$_id" } }
    ]);

    res.json({
        success: true,
        subjects: subjects.map(s => s.subject)
    });
};

/* ========== GET ASSIGNED SUBJECTS ========== */
exports.getAssignedSubjects = async (req, res) => {
    // ✅ ONLY FIX (clean course string)
    const cleanCourse = req.params.courseCode
        .trim()
        .replace(/\s+/g, " ");

    const data = await CourseSubject.findOne({
        courseCode: cleanCourse
    });

    res.json({
        success: true,
        subjects: data ? data.subjects : []
    });
};

/* ========== ASSIGN SUBJECTS TO COURSE ========== */
exports.assignSubjects = async (req, res) => {
    const { courseCode, subjects } = req.body;

    if (!courseCode || !Array.isArray(subjects)) {
        return res.status(400).json({ success: false });
    }

    // ✅ ONLY FIX (clean course string)
    const cleanCourse = courseCode
        .trim()
        .replace(/\s+/g, " ");

    // 🔥 NORMALIZE SUBJECTS (already correct)
    const cleanSubjects = subjects.map(s =>
        s.trim().toLowerCase()
    );

    await CourseSubject.findOneAndUpdate(
        { courseCode: cleanCourse },
        { subjects: cleanSubjects },
        { upsert: true, new: true }
    );

    res.json({
        success: true,
        message: "Subjects assigned successfully"
    });
};

/* ========== ALL MAPPINGS ========== */
exports.getAllMappings = async (req, res) => {
    const data = await CourseSubject.find().sort({ updatedAt: -1 });
    res.json({ success: true, data });
};