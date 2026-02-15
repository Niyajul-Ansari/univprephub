const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const admin = require("../middlewares/adminMiddleware");

const ctrl = require("../controllers/courseSubjectController");

router.get("/available-subjects", auth, admin, ctrl.getAvailableSubjects);
router.get("/:courseCode", auth, admin, ctrl.getAssignedSubjects);
router.post("/assign", auth, admin, ctrl.assignSubjects);
router.get("/", auth, admin, ctrl.getAllMappings);

module.exports = router;
