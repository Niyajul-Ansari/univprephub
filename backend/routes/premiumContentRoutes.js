const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");
const upload = require("../middlewares/pdfUpload"); // ✅ ADD THIS

// controller (correct)
const premiumContent = require("../controllers/premiumContent");

/* ========== CREATE (PDF FILE) ========== */
router.post(
    "/create",
    auth,
    admin,
    upload.single("pdf"),     // ✅ PDF upload
    premiumContent.create
);

/* ========== READ ALL ========== */
router.get(
    "/all",
    auth,
    admin,
    premiumContent.getAll
);

/* ========== UPDATE (OPTIONAL PDF REPLACE) ========== */
router.put(
    "/:id",
    auth,
    admin,
    upload.single("pdf"),     // ✅ PDF optional on update
    premiumContent.update
);

/* ========== TOGGLE HIDE ========== */
router.put(
    "/toggle/:id",
    auth,
    admin,
    premiumContent.toggle
);

/* ========== DELETE ========== */
router.delete(
    "/:id",
    auth,
    admin,
    premiumContent.remove
);

module.exports = router;
