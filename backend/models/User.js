const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: String,

    // 🔐 UNIQUE 5 DIGIT SECRET
    secretCode: { type: String, index: true },

    // 🔑 MAIN APPROVAL = VIDEO + LOGIN
    isApproved: { type: Boolean, default: false },

    role: { type: String, default: "user" },

    // 📚 ONLY PREMIUM NOTES NEED EXTRA ACCESS
    permissions: {
        notes: {
            access: { type: Boolean, default: false },
            courses: [String]
        }
    }
});

module.exports = mongoose.model("User", userSchema);
