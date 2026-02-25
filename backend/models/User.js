const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: String,
    avatar: String,

    secretCode: { type: String, index: true },

    // 🔥 VIDEO + DASHBOARD ACCESS
    isApproved: { type: Boolean, default: false },

    // 🎯 ASSIGNED COURSE FOR VIDEO/PDF
    assignedCourse: {
        type: String,
        default: null
    },

    role: { type: String, default: "user" },

    // 📘 EBOOK ACCESS (RENAMED)
    permissions: {
        ebook: {
            access: { type: Boolean, default: false }
        }
    }
});

module.exports = mongoose.model("User", userSchema);