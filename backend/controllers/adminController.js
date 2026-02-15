const User = require("../models/User");

// ================= ADMIN DASHBOARD =================
exports.dashboard = async (req, res) => {
    try {
        const users = await User.find({ role: "user", isApproved: false });

        return res.json({
            success: true,
            pendingUsers: users
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error loading admin dashboard"
        });
    }
};

// ================= APPROVE USER =================
exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role === "admin") {
            return res.status(400).json({
                success: false,
                message: "Admin approval not required"
            });
        }

        if (user.isApproved) {
            return res.json({
                success: false,
                message: "User already approved"
            });
        }

        user.isApproved = true;
        await user.save();

        return res.json({
            success: true,
            message: "User approved successfully"
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error approving user"
        });
    }
};
