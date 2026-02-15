const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/pdfs");
    },
    filename: (req, file, cb) => {
        // topicName from form
        const title = req.body.topicName || "premium-content";

        // clean filename (spaces & special chars remove)
        const safeTitle = title
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-");

        cb(null, safeTitle + ".pdf");
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF allowed"), false);
    }
};

module.exports = multer({
    storage,
    fileFilter
});
