const mongoose = require("mongoose");

const premiumContentSchema = new mongoose.Schema(
    {
        subject: String,
        topicName: String,
        videoLink: String,
        pdfLink: {
            type: String,
            default: ""
        },
        isHidden: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("PremiumContent", premiumContentSchema);
