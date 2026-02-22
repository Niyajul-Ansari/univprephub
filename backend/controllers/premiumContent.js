const PremiumContent = require("../models/PremiumContent");

/* ========== CREATE ========== */
exports.create = async (req, res) => {
    try {
        const data = new PremiumContent({
            subject: req.body.subject,
            topicName: req.body.topicName,
            videoLink: req.body.videoLink,
            pdfLink: req.file ? req.file.path : "",
        });

        await data.save();

        res.json({
            success: true,
            data
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* ========== READ ALL (ADMIN) ========== */
exports.getAll = async (req, res) => {
    const data = await PremiumContent.find().sort({ createdAt: -1 });
    res.json(data);
};

exports.getUserPremium = async (req, res) => {
    try {
        const filter =
            req.user.role === "admin"
                ? {}                  // ✅ admin → all content
                : { isHidden: false } // ✅ user → only visible

        const contents = await PremiumContent
            .find(filter)
            .sort({ createdAt: 1 });

        res.json({
            success: true,
            data: contents
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

/* ========== UPDATE ========== */
exports.update = async (req, res) => {
    const updateData = {
        subject: req.body.subject,
        topicName: req.body.topicName,
        videoLink: req.body.videoLink
    };

    if (req.file) {
        updateData.pdfLink = req.file.path;
    }

    await PremiumContent.findByIdAndUpdate(req.params.id, updateData);
    res.json({ success: true });
};

/* ========== TOGGLE HIDE ========== */
exports.toggle = async (req, res) => {
    const item = await PremiumContent.findById(req.params.id);
    item.isHidden = !item.isHidden;
    await item.save();
    res.json({ success: true });
};

/* ========== DELETE ========== */
exports.remove = async (req, res) => {
    await PremiumContent.findByIdAndDelete(req.params.id);
    res.json({ success: true });
};