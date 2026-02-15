const PremiumContent = require("../models/PremiumContent");
const CourseSubject = require("../models/CourseSubject");

/* ========== GET AVAILABLE SUBJECTS (FROM PREMIUM) ========== */
exports.getAvailableSubjects = async (req, res) => {
    const subjects = await PremiumContent.aggregate([
        { $match: { isHidden: false } },      // only visible
        { $group: { _id: "$subject" } },
        { $project: { _id: 0, subject: "$_id" } }
    ]);

    res.json({
        success: true,
        subjects: subjects.map(s => s.subject)
    });
};

/* ========== GET ASSIGNED SUBJECTS FOR COURSE ========== */
exports.getAssignedSubjects = async (req, res) => {
    const { courseCode } = req.params;

    const data = await CourseSubject.findOne({ courseCode });

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

    await CourseSubject.findOneAndUpdate(
        { courseCode },
        { subjects },
        { upsert: true }
    );

    res.json({
        success: true,
        message: "Subjects assigned successfully"
    });
};

/* ========== ALL COURSE MAPPINGS (FOR UI TABLE) ========== */
exports.getAllMappings = async (req, res) => {
    const data = await CourseSubject.find().sort({ updatedAt: -1 });
    res.json({ success: true, data });
};
