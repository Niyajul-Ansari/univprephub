const mongoose = require("mongoose");

const courseSubjectSchema = new mongoose.Schema(
    {
        courseCode: {
            type: String,   // e.g. "B04"
            required: true,
            unique: true
        },
        subjects: [
            {
                type: String   // e.g. "Indian Polity"
            }
        ]
    },
    { timestamps: true }
);

module.exports = mongoose.model("CourseSubject", courseSubjectSchema);
