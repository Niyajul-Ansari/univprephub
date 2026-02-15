const Notes = require("../models/Note");

// GET ALL NOTES
exports.getNotes = async (req, res) => {
    try {
        const notes = await Notes.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, notes });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// CREATE NEW NOTE (Admin Only)
exports.createNote = async (req, res) => {
    try {
        const { title, link } = req.body;
        if (!title || !link) {
            return res.status(400).json({
                success: false,
                message: "Title & Google Drive link are required"
            });
        }

        const note = await Notes.create({ title, link });
        return res.status(201).json({ success: true, message: "Note saved", note });

    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};

// STREAM PDF FROM GOOGLE DRIVE
// exports.getSinglePDF = async (req, res) => {
//     try {
//         const note = await Notes.findById(req.params.id);
//         if (!note) {
//             return res.status(404).json({ success: false, message: "Note not found" });
//         }

//         const match = note.link.match(/[-\w]{25,}/);
//         if (!match) {
//             return res.status(400).json({ success: false, message: "Invalid Google Drive link" });
//         }

//         const fileId = match[0];

//         const previewURL = `https://drive.google.com/file/d/${fileId}/preview`;

//         res.status(200).json({
//             success: true,
//             url: previewURL
//         });

//     } catch (err) {
//         return res.status(500).json({ success: false, message: "Error generating preview" });
//     }
// };

const fetch = require("node-fetch");

exports.getPdfFile = async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id);
        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found" });
        }

        const match = note.link.match(/[-\w]{25,}/);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid Google Drive link" });
        }

        const fileId = match[0];
        const downloadURL = `https://drive.google.com/uc?export=download&id=${fileId}`;

        const response = await fetch(downloadURL);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline");

        response.body.pipe(res);

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Error fetching PDF" });
    }
};



