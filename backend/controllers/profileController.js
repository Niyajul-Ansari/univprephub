const User = require("../models/User");
const fs = require("fs");
const path = require("path");

exports.removeAvatar = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user || !user.avatar) {
            return res.json({
                success: false,
                message: "No avatar to remove"
            });
        }

        // 🔥 delete file from disk
        const filePath = path.join(
            __dirname,
            "..",
            user.avatar
        );

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // 🔁 remove from DB
        user.avatar = null;
        await user.save();

        res.json({
            success: true
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Remove avatar failed"
        });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.json({
                success: false,
                message: "No file uploaded"
            });
        }

        const avatarPath = `/uploads/avatars/${req.file.filename}`;

        const user = await User.findById(req.user._id);
        user.avatar = avatarPath;
        await user.save();

        res.json({
            success: true,
            avatar: avatarPath
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Upload failed"
        });
    }
};