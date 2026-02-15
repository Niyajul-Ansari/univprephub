const PremiumContent = require("../models/PremiumContent");

/* ========== ADMIN CREATE ========== */
exports.create = async (req, res) => {
    const content = await PremiumContent.create({
        subject: req.body.subject,
        topicName: req.body.topicName,
        videoLink: req.body.videoLink || "",
        pdfLink: req.file ? req.file.path : ""   // ✅ PDF FILE PATH
    });

    res.status(201).json({
        success: true,
        data: content
    });
};

/* ========== ADMIN READ ALL ========== */
exports.getAll = async (req, res) => {
    const data = await PremiumContent.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
};

/* ========== ADMIN UPDATE ========== */
exports.update = async (req, res) => {
    const updateData = {
        subject: req.body.subject,
        topicName: req.body.topicName,
        videoLink: req.body.videoLink
    };

    // ✅ Agar naya PDF aaya to hi replace hoga
    if (req.file) {
        updateData.pdfLink = req.file.path;
    }

    await PremiumContent.findByIdAndUpdate(req.params.id, updateData);

    res.json({ success: true, message: "Updated" });
};

/* ========== ADMIN TOGGLE HIDE ========== */
exports.toggle = async (req, res) => {
    const content = await PremiumContent.findById(req.params.id);
    content.isHidden = !content.isHidden;
    await content.save();

    res.json({ success: true });
};

/* ========== ADMIN DELETE ========== */
exports.remove = async (req, res) => {
    await PremiumContent.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
};
