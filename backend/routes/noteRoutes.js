const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const noteController = require("../controllers/notesController");

router.get("/", authMiddleware, noteController.getNotes);
router.post("/", authMiddleware, noteController.createNote);
router.get("/file/:id", authMiddleware, noteController.getPdfFile);


module.exports = router;
