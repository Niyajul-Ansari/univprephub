const mongoose = require("mongoose");

const premiumContentSchema = new mongoose.Schema(
    {
        subject: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },
        topicName: {
            type: String,
            required: true,
            trim: true
        },
        videoLink: {
            type: String,
            default: ""
        },
        pdfLink: {
            type: String,
            default: ""
        },
        isHidden: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("PremiumContent", premiumContentSchema);